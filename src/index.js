import {
    createContainer,
    createControls,
    createPerspectiveCamera,
    createRenderer,
    createScene,
    createStats
} from "./helpers";

import * as THREE from 'three';

main();

function main() {
    let container, renderer, scene, camera, controls, stats;


    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 120, y: 100, z: 400});
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats, container);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(0, 6, 6);
        scene.add(directionalLight);


        container.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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
}