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

    let isArrowUp = false;
    let isArrowDown = false;
    let isArrowRight = false;
    let isArrowLeft = false;
    let isSpace = false;
    let isEnter = false;


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
        distance = distance.subVectors(box1Mesh.position, box2Mesh.position).length();

        // const distance = box1WorldPosition.distanceTo(box2WorldPosition);
        // console.log(distance);
        // console.log(box1Mesh.position.subVectors(box2Mesh.position));
        // distance.set(box1Mesh.position.x - box2Mesh.position.x, box1Mesh.position.y - box2Mesh.position.y, box1Mesh.position.z - box2Mesh.position.z);
        // console.log(box1Mesh.position);
        // console.log(box2Mesh.position);
        // console.log(distance.subVectors(box1Mesh.position, box2Mesh.position));
        // console.log(distance.normalize());
        // distance = box1Mesh.position.distanceTo(box2Mesh.position);
        // console.log(distance);
        // distance = distance.subVectors(box1Mesh.position, box2Mesh.position).length();
        // distance = distance.subVectors(box1Mesh.position, box2Mesh.position).length();

        clock = new THREE.Clock();
        renderer = createRenderer(renderer);
        controls = createControls(controls, camera, renderer);
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('keydown', setBoxDirection);
    }

    function setBoxDirection(e) {
        let code = e.code;
        if (code === 'ArrowUp') {
            isArrowUp = true;
            isArrowDown = false;
            isArrowRight = false;
            isArrowLeft = false;
            isEnter = false;
        } else if (code === 'ArrowDown') {
            isArrowUp = false;
            isArrowDown = true;
            isArrowRight = false;
            isArrowLeft = false;
            isEnter = false;
        } else if (code === 'ArrowRight') {
            isArrowUp = false;
            isArrowDown = false;
            isArrowRight = true;
            isArrowLeft = false;
            isEnter = false;
        } else if (code === 'ArrowLeft') {
            isArrowUp = false;
            isArrowDown = false;
            isArrowRight = false;
            isArrowLeft = true;
            isEnter = false;
        } else if (code === 'Enter') {
            isArrowUp = false;
            isArrowDown = false;
            isArrowRight = false;
            isArrowLeft = false;
            isSpace = false;
            isEnter = true;
        } else if (code === 'Space') {
            isSpace = true;
        }
    }

    function animate() {
        render();
        stats.update();
        requestAnimationFrame(animate);
    }


    function render() {
        const now = performance.now();
        const delta = clock.getDelta();
        let theDistance = new THREE.Vector3();
        theDistance = theDistance.subVectors(box1Mesh.position, box2Mesh.position).length();
        console.log(theDistance);

        if (isArrowUp) {
            box1Mesh.position.z -= .5;
        } else if (isArrowDown) {
            box1Mesh.position.z += .5;
        } else if (isArrowRight) {
            box1Mesh.position.x += .5;
        } else if (isArrowLeft) {
            box1Mesh.position.x -= .5;
        }

        if (isSpace) {
            box1Mesh.position.y += 1.5;
            if(box1Mesh.position.y === 20){
                isSpace = false;
            }
        } else if (box1Mesh.position.y > 5) {
            box1Mesh.position.y -= 1.5;
        }


        let speed = .05;


        controls.update();
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}