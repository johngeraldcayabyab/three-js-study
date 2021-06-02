import * as THREE from 'three';
import Stats from 'stats.js';
import {desktopFOV} from "./FIeldOfViews";


function main() {

    let container, stats, camera, scene, renderer;

    const clock = new THREE.Clock();
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;

    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(desktopFOV(), windowInnerWidth / windowInnerHeight, 1, 3000);
        camera.position.z = 250;
        camera.lookAt(0, 0, 0);

        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(windowInnerWidth, windowInnerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        stats = new Stats();
        container.appendChild(stats.dom);
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        renderer.setSize(windowInnerWidth, windowInnerHeight);
        camera.aspect = windowInnerWidth / windowInnerHeight;
        camera.updateProjectionMatrix();
    }

    function animate(time) {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function render() {
        const delta = clock.getDelta();
        renderer.render(scene, camera);
    }
}

main();