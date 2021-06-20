import * as THREE from 'three';
import {createContainer, createRenderer, createStats} from "./helpers";
import GUI from 'dat.gui';
import {GPUComputationRenderer} from "three/examples/jsm/misc/GPUComputationRenderer";

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

    let container, renderer, scene, camera, stats, gui;

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

        container.style.touchAction = 'none';
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

        initBirds();
    }

    function onPointerMove() {

    }

    function onWindowResize() {

    }

    function initBirds() {

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

    }

    function fillPositionTexture(texture) {

    }

    function isSafari() {

    }

    function animate() {

    }
}