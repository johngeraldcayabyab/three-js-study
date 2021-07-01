import {
    createContainer,
    createControls,
    createPerspectiveCamera,
    createRenderer,
    createScene,
    createStats
} from "./helpers";

import * as THREE from 'three';
import {createPineTree, createPlane} from "./object_generator";

main();

function main() {
    let container, renderer, scene, camera, controls, stats;

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 10, y: 5, z: 10});
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats, container);

        const plane = createPlane();
        scene.add(plane);

        const pineTree = createPineTree();
        scene.add(pineTree);


        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);
        scene.add(camera);


        container.addEventListener('resize', onWindowResize);
    }

    function animate() {
        render();
        stats.update();
        requestAnimationFrame(animate);
    }

    function render() {
        controls.update();
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}