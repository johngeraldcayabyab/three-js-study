import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ImprovedNoise} from "three/examples/jsm/math/ImprovedNoise";


main();

function main() {

    let container, stats;

    let camera, controls, scene, renderer;

    let mesh, texture;

    const worldWidth = 256, worldDepth = 256, worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

    let helper;


    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;

    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);
        container.setAttribute('id', 'container');
        container = document.getElementById('container');
        container.innerHTML = '';

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(windowInnerWidth, windowInnerHeight);
        container.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xbfd1e5);

        camera = new THREE.PerspectiveCamera(60, windowInnerWidth / windowInnerHeight, 10, 20000);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 1000;
        controls.maxDistance = 10000;
        controls.maxPolarAngle = Math.PI / 2;

        const data = generateHeight(worldWidth, worldDepth);
    }

    function generateHeight(width, height) {
        const size = width * height, data = new Uint8Array(size),
            perlin = new ImprovedNoise(), z = Math.random() * 100;

        console.log(data);


        let quality = 1;
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < size; i++) {
                const x = i % width, y = ~~(i / width);
                data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
            }
            quality *= 5;
        }
        return data;
    }

    function animate() {

    }

    function onWindowResize() {

    }

    function render() {

    }
}

