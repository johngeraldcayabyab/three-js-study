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
        camera = createPerspectiveCamera(camera, {x : 10, y: 5, z:10});
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats, container);



        const group = new THREE.Group();

        const level1 = new THREE.Mesh(
            new THREE.ConeGeometry(1.5, 2,8),
            new THREE.MeshLambertMaterial({color: 0x000ff00})
        );
        level1.position.y = 4;
        group.add(level1);

        const level2 = new THREE.Mesh(
            new THREE.ConeGeometry(2,2,8),
            new THREE.MeshLambertMaterial({color: 0x00ff00})
        );
        level2.position.y = 3;
        group.add(level2);

        const level3 = new THREE.Mesh(
            new THREE.ConeGeometry(3,2,8),
            new THREE.MeshLambertMaterial({color: 0x00ff00})
        );
        level3.position.y = 2;
        group.add(level3);

        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.5, 2),
            new THREE.MeshLambertMaterial({color: 0xbb6600})
        );
        trunk.position.y = 0;
        group.add(trunk);


        scene.add(group);



        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);
        scene.add(camera);


        let createPlane = () => {
            const geometry = new THREE.PlaneGeometry(500, 500, 32);
            const material = new THREE.MeshLambertMaterial({color: 0x6584b5, side: THREE.DoubleSide});
            return new THREE.Mesh(geometry, material);
        };

        const plane = createPlane();
        plane.rotation.x = 300;
        scene.add(plane);


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