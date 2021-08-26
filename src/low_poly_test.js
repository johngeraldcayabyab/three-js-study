import "../style.css";
import * as THREE from 'three';
import {createRenderer} from "../utils/scaffold.js";
import {createScene} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";
import {createPlane} from "../utils/object_generator.js";
import {createPineTree} from "../utils/object_generator.js";
import {createCloud} from "../utils/object_generator.js";

main();

function main() {
    let renderer, scene, camera, controls, stats, clock;
    let last = performance.now();
    let box1Mesh, box2Mesh, box1WorldPosition, box2WorldPosition;
    let pineTree, pineTreeVector;
    let distance = new THREE.Vector3();

    init();
    animate();

    function init() {
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 10, y: 100, z: 100});
        stats = createStats(stats);

        const plane = createPlane();
        scene.add(plane);

        pineTree = createPineTree();
        scene.add(pineTree);

        const cloud = createCloud();
        scene.add(cloud);

        const light2 = new THREE.DirectionalLight(0xff5566, 0.7);
        light2.position.set(-3, -1, 0).normalize();
        scene.add(light2);

        const light3 = new THREE.DirectionalLight(0xffffff, 0.7);
        light3.position.set(1, 1, 0).normalize();
        scene.add(light3);
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));

        // const box1Position = new THREE.Vector3();
        // console.log(box1Position.);
        const box1Material = new THREE.MeshPhongMaterial();
        const box1Geometry = new THREE.BoxGeometry(10, 10, 10);
        box1Mesh = new THREE.Mesh(box1Geometry, box1Material);
        box1Mesh.position.y = 5;
        box1Mesh.position.z = 20;
        // box1WorldPosition = box1Mesh.getWorldPosition(box1Position).normalize();
        // console.log(box1Mesh.position);
        scene.add(box1Mesh);

        // const box2Position = new THREE.Vector3();
        const box2Material = new THREE.MeshPhongMaterial();
        const box2Geometry = new THREE.BoxGeometry(10, 10, 10);
        box2Mesh = new THREE.Mesh(box2Geometry, box2Material);
        box2Mesh.position.x = 50;
        box2Mesh.position.y = 5;
        box2Mesh.position.z = -20;
        // box2Mesh.getWorldPosition(box2Position);
        // box2WorldPosition = box2Mesh.getWorldPosition(box2Position).normalize();
        // console.log(box2Mesh.position);
        scene.add(box2Mesh);

        // const distance = box1WorldPosition.distanceTo(box2WorldPosition);
        // console.log(distance);

        distance.set(box1Mesh.position.x - box2Mesh.position.x, box1Mesh.position.y - box2Mesh.position.y, box1Mesh.position.z - box2Mesh.position.z);
        console.log(box1Mesh.position);
        console.log(box2Mesh.position);
        console.log(distance.length());
        console.log(distance.normalize());
        // distance = box1Mesh.position.distanceTo(box2Mesh.position);
        // console.log(distance);


        clock = new THREE.Clock();
        renderer = createRenderer(renderer);
        controls = createControls(controls, camera, renderer);
        window.addEventListener('resize', onWindowResize);
    }

    function animate() {
        render();
        stats.update();
        requestAnimationFrame(animate);
    }

    function render() {
        const now = performance.now();
        const delta = clock.getDelta();
        // console.log(delta);


        // box1Mesh.position.x += 1;


        let speed = .05;

        // console.log(box1Mesh.getWorldPosition());

        // box2Normalized = box2
        // Normalized.multiplyScalar(speed * delta);
        // console.log(box2Normalized.x);
        // box1Mesh.position.x += box2Normalized.x;
        // console.log(box1Mesh);
        // box1Mesh.setXYZ(box2Normalized);
        // console.log(box2Normalized);


        // box1Mesh.setPosition(box2Normalized * speed * delta);

        // console.log(box2Normalized);
        // box1Normalized.multiplyScalar(speed);
        // box1Mesh.position.x += box2Normalized

        controls.update();
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}