import * as THREE from 'three';
import Stats from 'stats.js';
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

        camera = new THREE.PerspectiveCamera(desktopFOV(), windowInnerWidth / windowInnerHeight, 1, 5000);
        camera.position.z = 50;
        camera.lookAt(0, 0, 0);

        scene = new THREE.Scene();


        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        scene.add(makeBox());


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

    function makeBox(width = 10, height = 10, depth = 10) {
        const boxGeometry = new THREE.BoxGeometry(width, height, depth);
        const boxMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        return boxMesh;
    }

    function onWindowResize() {
        renderer.setSize(windowInnerWidth, windowInnerHeight);
        camera.aspect = windowInnerWidth / windowInnerHeight;
        camera.updateProjectionMatrix();
    }

    function animate(time) {
        requestAnimationFrame(animate);
        render();
        controls.update();
        stats.update();
    }

    function render() {
        const delta = clock.getDelta();
        renderer.render(scene, camera);
    }
}

main();