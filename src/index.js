import * as THREE from 'three';
import Stats from 'stats.js';
import {SimplexNoise} from "./SimplexNoise";
import {GUI} from "dat.gui";
import {GPUComputationRenderer} from "three/examples/jsm/misc/GPUComputationRenderer";
import {desktopFOV} from "./FIeldOfViews";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

function main() {

    let container, stats, camera, scene, renderer, controls;

    const clock = new THREE.Clock();
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;


    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(desktopFOV(), windowInnerWidth / windowInnerHeight, 1, 40000);
        camera.position.z = 250;
        camera.lookAt(0, 0, 0);

        scene = new THREE.Scene();
        scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
        scene.fog = new THREE.Fog(scene.background, 1, 40000)

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(windowInnerWidth, windowInnerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);

        stats = new Stats();
        container.appendChild(stats.dom);
        window.addEventListener('resize', onWindowResize);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function onWindowResize() {
        renderer.setSize(windowInnerWidth, windowInnerHeight);
        camera.aspect = windowInnerWidth / windowInnerHeight;
        camera.updateProjectionMatrix();
    }

    function render() {
        const delta = clock.getDelta();
        controls.update(delta);
        renderer.render(scene, camera);
    }
}

main();
