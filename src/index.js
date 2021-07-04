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

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 10, y: 7, z: 100});
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats, container);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(0, 6, 6);
        scene.add(directionalLight);

        const hlp = new THREE.GridHelper(2, 20);
        scene.add(hlp);

        let t;
        const n0 = new THREE.Vector3(0, 1, 0);
        const n = new THREE.Vector3();
        const b = new THREE.Vector3();
        const M3 = new THREE.Matrix3();
        const M4 = new THREE.Matrix4();
        let f = 0;
        let p = new THREE.Vector3();

        const somePoints = [
            new THREE.Vector3(-1, 0, -1),
            new THREE.Vector3(0, 0, -0.8),

            new THREE.Vector3(1, 0.2, -1),
            new THREE.Vector3(0.8, 0.1, 0),

            new THREE.Vector3(-1, 0.4, 1),
            new THREE.Vector3(-0.8, 0.2, 0),
        ];

        const pts = new THREE.Points(new THREE.BufferGeometry().setFromPoints(somePoints), new THREE.PointsMaterial({color: "white", size: 0.04}));
        scene.add(pts);

        const curve = new THREE.CatmullRomCurve3(somePoints);
        curve.closed = true;

        const points = curve.getPoints(80);
        const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({color: 0xffffaa}));
        scene.add(line);

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
        renderer.renderer(scene, camera);
    }
}