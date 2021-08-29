import * as THREE from 'three';
import {createRenderer} from "../utils/scaffold.js";
import {createScene} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";
main();

function main() {
    let renderer, scene, camera, controls, stats;

    let leavesMaterial;
    const clock = new THREE.Clock();

    init();
    animate();

    function init() {
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 10, y: 7, z: 10});
        stats = createStats(stats);

        const vertexShader = `
                varying vec2 vUv;
                uniform float time;

                void main(){
                    vUv = uv;

                    // VERTEX POSITION

                    vec4 mvPosition = vec4(position, 1.0);
                    #ifdef USE_INSTANCING
                        mvPosition = instanceMatrix * mvPosition;
                    #endif

                    // DISPLACEMENT

                    // here the displacement is made stronger on the blade tips.
                    float dispPower = 1.0 - cos(uv.y * 3.1416 / 2.0);

                    float displacement = sin(mvPosition.z + time * 10.0) * (0.1 * dispPower);
                    mvPosition.z += displacement;

                    //

                    vec4 modelViewPosition = modelViewMatrix * mvPosition;
                    gl_Position = projectionMatrix * modelViewPosition;
                }
            `;

        const fragmentShader = `
                varying vec2 vUv;

                void main(){
                    vec3 baseColor = vec3(0.41, 1.0, 0.5);
                    float clarity = (vUv.y * 0.5) + 0.5;
                    gl_FragColor = vec4(baseColor * clarity, 1);
                }
            `;

        const uniforms = {
            time: {
                value: 0
            }
        };

        leavesMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            side: THREE.DoubleSide
        });

        const instanceNumber = 5000;
        const dummy = new THREE.Object3D()

        const geometry = new THREE.PlaneGeometry(0.1, 1, 1, 4);
        geometry.translate(0, 0.5, 0);

        const instancedMesh = new THREE.InstancedMesh(geometry, leavesMaterial, instanceNumber);

        scene.add(instancedMesh);


        for (let i = 0; i < instanceNumber; i++) {
            dummy.position.set(
                (Math.random() - 0.5) * 10,
                0,
                (Math.random() - 0.5) * 10
            );

            dummy.scale.setScalar(0.5 + Math.random() * 0.5);
            dummy.rotation.y = Math.random() * Math.PI;

            dummy.updateMatrix();
            instancedMesh.setMatrixAt(i, dummy.matrix);
        }

        renderer = createRenderer(renderer);
        controls = createControls(controls, camera, renderer);
        window.addEventListener('resize', onWindowResize);
    }

    function render() {
        controls.update();
        renderer.render(scene, camera);
    }


    function animate() {
        leavesMaterial.uniforms.time.value = clock.getElapsedTime();
        leavesMaterial.uniformsNeedUpdate = true;
        render();
        stats.update();
        requestAnimationFrame(animate);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setScalar(window.innerWidth, window.innerHeight);
    }
}