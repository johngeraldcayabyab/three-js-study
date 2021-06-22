import * as THREE from 'three';
import {createContainer, createRenderer, createStats} from "./helpers";
import {GUI} from "dat.gui";
import {GPUComputationRenderer} from "three/examples/jsm/misc/GPUComputationRenderer";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

main();

function main() {

    const WIDTH = 32;
    const BIRDS = WIDTH * WIDTH;

    class BirdGeometry extends THREE.BufferGeometry {
        constructor() {
            super();

            const trianglesPerBird = 3;
            const triangles = BIRDS * trianglesPerBird;
            const points = triangles * 3;

            const vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
            const birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
            const references = new THREE.BufferAttribute(new Float32Array(points * 2), 2);
            const birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1);

            this.setAttribute('position', vertices);
            this.setAttribute('birdColor', birdColors);
            this.setAttribute('reference', references);
            this.setAttribute('birdVertex', birdVertex);

            let v = 0;

            function verts_push() {
                for (let i = 0; i < arguments.length; i++) {
                    vertices.array[v++] = arguments[i];
                }
            }

            const wingsSpan = 20;
            for (let f = 0; f < BIRDS; f++) {
                verts_push(
                    0, -0, -20,
                    0, 4, -20,
                    0, 0, 30
                );
                verts_push(
                    0, 0, -15,
                    wingsSpan, 0, 0,
                    0, 0, -15,
                );
                verts_push(
                    0, 0, 15,
                    wingsSpan, 0, 0,
                    0, 0, -15
                );
            }

            for (let v = 0; v < triangles * 3; v++) {
                const triangleIndex = ~~(v / 3);
                const birdIndex = ~~(triangleIndex / trianglesPerBird);
                const x = (birdIndex % WIDTH) / WIDTH;
                const y = ~~(birdIndex / WIDTH) / WIDTH;

                const c = new THREE.Color(
                    0x444444 +
                    ~~(v / 9) / BIRDS * 0x666666
                );

                birdColors.array[v * 3 + 0] = c.r;
                birdColors.array[v * 3 + 1] = c.g;
                birdColors.array[v * 3 + 2] = c.b;

                references.array[v * 2] = x;
                references.array[v * 2 + 1] = y;

                birdVertex.array[v] = v % 9;
            }

            this.scale(0.2, 0.2, 0.2);
        }
    }

    let container, renderer, scene, camera, stats, controls;

    let mouseX = 0, mouseY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;

    let last = performance.now();

    let gpuCompute;
    let velocityVariable;
    let positionVariable;
    let positionUniforms;
    let velocityUniforms;
    let birdUniforms;

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        stats = createStats(stats, container);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
        camera.position.z = 350;





        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene.fog = new THREE.Fog(0xffffff, 100, 1000);

        initComputeRenderer();

        // container.style.touchAction = 'none';
        container.addEventListener('pointermove', onPointerMove);

        window.addEventListener('resize', onWindowResize);

        const gui = new GUI();

        const effectController = {
            separation: 20.0,
            alignment: 20.0,
            cohesion: 20.0,
            freedom: 0.75
        };

        const valuesChanger = function () {
            velocityUniforms['separationDistance'].value = effectController.separation;
            velocityUniforms['alignmentDistance'].value = effectController.alignment;
            velocityUniforms['cohesionDistance'].value = effectController.cohesion;
            velocityUniforms['freedomFactor'].value = effectController.freedom;
        };

        valuesChanger();

        gui.add(effectController, 'separation', 0.0, 100.0, 1.0).onChange(valuesChanger);
        gui.add(effectController, 'alignment', 0.0, 100, 0.001).onChange(valuesChanger);
        gui.add(effectController, 'cohesion', 0.0, 100.0, 0.025).onChange(valuesChanger);
        gui.close();

        controls = new OrbitControls(camera, renderer.domElement);
        initBirds();
    }

    function onPointerMove() {
        if (event.isPrimary === false) return;

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function initBirds() {
        const geometry = new BirdGeometry();

        birdUniforms = {
            'color': {value: new THREE.Color(0xff2200)},
            'texturePosition': {value: null},
            'textureVelocity': {value: null},
            'time': {value: 1.0},
            'delta': {value: 0.0}
        };

        const material = new THREE.ShaderMaterial({
            uniforms: birdUniforms,
            vertexShader: document.getElementById('birdVS').textContent,
            fragmentShader: document.getElementById('birdFS').textContent,
            side: THREE.DoubleSide
        });

        const birdMesh = new THREE.Mesh(geometry, material);
        birdMesh.rotation.y = Math.PI / 2;
        birdMesh.matrixAutoUpdate = false;
        birdMesh.updateMatrix();

        scene.add(birdMesh);
    }

    function initComputeRenderer() {
        gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
        if (isSafari()) {
            gpuCompute.setDataType(THREE.HalfFloatType);
        }

        const dtPosition = gpuCompute.createTexture();
        const dtVelocity = gpuCompute.createTexture();
        fillPositionTexture(dtPosition);
        fillPositionTexture(dtVelocity);

        velocityVariable = gpuCompute.addVariable('textureVelocity', document.getElementById('fragmentShaderVelocity').textContent, dtVelocity);
        positionVariable = gpuCompute.addVariable('texturePosition', document.getElementById('fragmentShaderPosition').textContent, dtPosition);

        gpuCompute.setVariableDependencies(velocityVariable, [positionVariable, velocityVariable]);
        gpuCompute.setVariableDependencies(positionVariable, [positionVariable, velocityVariable]);

        positionUniforms = positionVariable.material.uniforms;
        velocityUniforms = velocityVariable.material.uniforms;

        positionUniforms['time'] = {value: 0.0};
        positionUniforms['delta'] = {value: 0.0};
        velocityUniforms['time'] = {value: 1.0};
        velocityUniforms['delta'] = {value: 0.0};
        velocityUniforms['testing'] = {value: 1.0};
        velocityUniforms['separationDistance'] = {value: 1.0};
        velocityUniforms['alignmentDistance'] = {value: 1.0};
        velocityUniforms['cohesionDistance'] = {value: 1.0};
        velocityUniforms['freedomFactor'] = {value: 1.0};
        velocityUniforms['predator'] = {value: new THREE.Vector3()};
        velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed(2);

        velocityVariable.wrapS = THREE.RepeatWrapping;
        velocityVariable.wrapT = THREE.RepeatWrapping;
        positionVariable.wrapS = THREE.RepeatWrapping;
        positionVariable.wrapT = THREE.RepeatWrapping;

        const error = gpuCompute.init();

        if (error !== null) {
            console.log(error);
        }
    }

    function fillPositionTexture(texture) {
        const theArray = texture.image.data;

        for (let k = 0, kl = theArray.length; k < kl; k += 4) {
            const x = Math.random() * BOUNDS - BOUNDS_HALF;
            const y = Math.random() * BOUNDS - BOUNDS_HALF;
            const z = Math.random() * BOUNDS - BOUNDS_HALF;

            theArray[k + 0] = x;
            theArray[k + 1] = y;
            theArray[k + 2] = z;
            theArray[k + 3] = 1;
        }
    }

    function isSafari() {
        return !!navigator.userAgent.match(/Safari/i) && !navigator.userAgent.match(/Chrome/i);
    }

    function animate() {
        controls.update();
        requestAnimationFrame(animate);

        render();
        stats.update();
    }

    function render() {
        const now = performance.now();
        let delta = (now - last) / 1000;

        if (delta > 1) delta = 1;
        last = now;

        positionUniforms['time'].value = now;
        positionUniforms['delta'].value = delta;
        velocityUniforms['time'].value = now;
        velocityUniforms['delta'].value = delta;
        birdUniforms['time'].value = now
        birdUniforms['delta'].valuje = delta;

        velocityUniforms['predator'].value.set(0.5 * mouseX / windowHalfX, -0.5 * mouseY / windowHalfY, 0);

        mouseX = 10000;
        mouseY = 10000;

        gpuCompute.compute();

        birdUniforms['texturePosition'].value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
        birdUniforms['textureVelocity'].value = gpuCompute.getCurrentRenderTarget(velocityVariable).texture;

        renderer.render(scene, camera);
    }
}