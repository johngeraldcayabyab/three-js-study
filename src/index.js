import {
    createContainer, createControls,
    createPerspectiveCamera,
    createRenderer,
    createScene,
    createStats,
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
        stats = createStats(stats, container);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera);
        controls = createControls(controls, camera, renderer);

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 32;

        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, 0, 32);
        gradient.addColorStop(0.0, '#014a84');
        gradient.addColorStop(0.0, '#0561a0');
        gradient.addColorStop(0.0, '#437ab6');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 32);

        const sky = new THREE.Mesh(
            new THREE.SphereGeometry(10),
            new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(canvas), side: THREE.BackSide})
        );
        scene.add(sky);

        const size = 128
        const data = new Uint8Array(size * size * size);
        console.log(data);


        window.addEventListener('resize', onWindowResize);
    }

    function animate() {
        render();
        requestAnimationFrame(animate);
    }

    function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }


    function render() {
        stats.update();
        renderer.render(scene, camera);
    }

}