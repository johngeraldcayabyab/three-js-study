import * as THREE from 'three/src/Three';
import {createContainer, createRenderer} from "./helpers";

function main() {

    let container, renderer, scene, camera, controls;

    const amount = parseInt(window.location.search.substr(1)) || 10;
    const count = Math.pow(amount, 3);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0, 1, 2000);
        camera.position.set(amount, amount, amount);
    }

    function animate(time) {
        requestAnimationFrame(animate);
        render();
    }

    function render() {

    }

    function onWindowResize() {

    }


    function onPointerMove() {

    }
}

