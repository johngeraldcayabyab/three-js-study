import * as THREE from 'three';
import {createContainer, createRenderer, createStats} from "./helpers";

function main() {

    let container, renderer, scene, camera, controls, stats;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        stats = createStats(stats, container);

        scene = new THREE.Scene();


        container.addEventListener('resize', onWindowResize);
    }

    function render() {
        renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

}