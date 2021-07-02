import {
    createContainer,
    createControls,
    createPerspectiveCamera,
    createRenderer,
    createScene,
    createStats
} from "./helpers";

import * as THREE from 'three';
import {createCloud, createPineTree, createPlane} from "./object_generator";

main();

function main() {
    let container, renderer, scene, camera, controls, stats;

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 10, y: 7, z: 10});
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats, container);

        const plane = createPlane();
        scene.add(plane);

        const pineTree = createPineTree();
        scene.add(pineTree);


        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        const cloud = createCloud();
        scene.add(cloud);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);
        scene.add(camera);


        // const bufferGeometry = new THREE.BufferGeometry();
        // const vertices = new Float32Array([
        //     -1.0, -1.0,  1.0,
        //     1.0, -1.0,  1.0,
        //     1.0,  1.0,  1.0,
        //
        //     1.0,  1.0,  1.0,
        //     -1.0,  1.0,  1.0,
        //     -1.0, -1.0,  1.0
        // ]);
        //
        // bufferGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        // const bufferMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        // const bufferMesh = new THREE.Mesh(bufferGeometry, bufferMaterial);
        // scene.add(bufferMesh);


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