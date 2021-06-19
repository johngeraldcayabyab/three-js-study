import * as THREE from 'three';
import {createContainer, createRenderer} from "./helpers";
import Stats from 'stats.js';
import GUI from 'dat.gui';

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


        stats = new Stats();
    }

    function animate() {

    }
}