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
        camera = createPerspectiveCamera(camera, {x: 5, y: 5, z: 20});
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats, container);

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 0, 1);
        scene.add(light);


        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;

        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0.1, 'rgba(210, 210,210, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const shadowTexture = new THREE.CanvasTexture(canvas);

        const shadowMaterial = new THREE.MeshBasicMaterial({map: shadowTexture});
        const shadowGeo = new THREE.PlaneGeometry(300, 300, 1, 1);

        let shadowMesh;

        shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
        shadowMesh.position.y = -250;
        shadowMesh.rotation.x = -Math.PI / 2;
        scene.add(shadowMesh);


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