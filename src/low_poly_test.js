import * as THREE from 'three';
import {createRenderer} from "../utils/scaffold.js";
import {createScene} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";
import {createAirplane, createPlane} from "../utils/object_generator.js";
import {createPineTree} from "../utils/object_generator.js";
import {createCloud} from "../utils/object_generator.js";
import {getWorldPosition, goToVector, makeAxesGrid} from "../utils/utils.js";

main();

function main() {
    let renderer, scene, camera, controls, stats, clock;
    let last = performance.now();
    let box1, box2, box3, airplane, pineTree;
    let distance = new THREE.Vector3();

    let isArrowUp = false;
    let isArrowDown = false;
    let isArrowRight = false;
    let isArrowLeft = false;
    let isSpace = false;
    let isEnter = false;
    let isDigit1 = false;
    let isDigit2 = false;

    let mouseVector = new THREE.Vector2();

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
        const box1Material = new THREE.MeshPhongMaterial({'color': 'red'});
        const box1Geometry = new THREE.BoxGeometry(10, 10, 10);
        box1 = new THREE.Mesh(box1Geometry, box1Material);
        box1.position.y = 5;
        box1.position.z = 20;
        // box1WorldPosition = box1Mesh.getWorldPosition(box1Position).normalize();
        // console.log(box1Mesh.position);
        scene.add(box1);

        makeAxesGrid(box1);

        const box2Material = new THREE.MeshPhongMaterial({color: 'green'});
        const box2Geometry = new THREE.BoxGeometry(10, 10, 10);
        box2 = new THREE.Mesh(box2Geometry, box2Material);
        box2.position.x = 50;
        box2.position.y = 5;
        box2.position.z = -20;

        scene.add(box2);
        distance = distance.subVectors(box1.position, box2.position).length();


        const box3Material = new THREE.MeshPhongMaterial({color: 'blue'});
        const box3Geometry = new THREE.BoxGeometry(10, 10, 10);
        box3 = new THREE.Mesh(box3Geometry, box3Material);
        box3.position.x = 100;
        box3.position.y = 5;
        box3.position.z = 100;


        scene.add(box3);


        // airplane = createAirplane();
        // airplane.scale.x = .2;
        // airplane.scale.y = .2;
        // airplane.scale.z = .2;
        // airplane.position.set(20, 9, 30);
        // scene.add(airplane);

        // airplane.lookAt(box1.position);
        // console.log(airplane.rotation);
        // airplane.rotation.z = 50;
        // airplane.lookAt(new THREE.Vector3(box3.position.x, box3.position.y, box3.position.z));
        // airplane.rotation =
        // airplane.rotation

        // makeAxesGrid(airplane, 20, 100);

        clock = new THREE.Clock();
        renderer = createRenderer(renderer);
        controls = createControls(controls, camera, renderer);
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('keydown', setBoxDirection);
        window.addEventListener('mousemove', onMouseMove);
    }

    function setBoxDirection(e) {
        let code = e.code;
        console.log(code);
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
        } else if (code === 'Digit1') {
            // isArrowUp = false;
            // isArrowDown = false;
            // isArrowRight = false;
            // isArrowLeft = false;
            // isEnter = false;
            isDigit1 = true;
            isDigit2 = false;
        } else if (code === 'Digit2') {
            // isArrowUp = false;
            // isArrowDown = false;
            // isArrowRight = false;
            // isArrowLeft = false;
            // isEnter = false;
            isDigit1 = false;
            isDigit2 = true;
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

    function animate(time) {
        render(time);
        stats.update();
        requestAnimationFrame(animate);
    }


    function airplaneAnimations() {
        airplane.children[7].rotation.x += 0.3;
        // airplane.rotation.z += .01;
        // console.log(airplane.rotation.z);
    }

    function box1Animations() {
        // box1.rotation.x += 0.01;
    }

    function render(time) {
        time *= 0.001;
        box1.position.y = Math.sin(time * 2) * 4;

        // // alert('kelp');
        // const now = performance.now();
        // const delta = clock.getDelta();
        // let subVector = new THREE.Vector3();
        // box1Animations();
        //
        // box2.position.dotVectors3()
        //
        // // console.log(mouseVector);
        //
        // // box1.lookAt(mouseVector);
        //
        // // airplaneAnimations();
        // // box1.lookAt(box2.position);
        // // goToVector(box1, box2);
        //
        // // direction.x =
        // // direction.x += .5;
        // // direction.x += .5;
        // //
        // // box1Mesh.position.multiplyVector3(direction);
        //
        // // console.log(distance, 'normalized');
        // // console.log(getWorldPosition(box1Mesh));
        //
        //
        // // console.log(theDistance, 'distance of box1 to box 2');
        //
        // // let object3d = new THREE.Vector3();
        // // let box1DistanceToWorldOrigin = object3d.getWorldPosition(box1Mesh.position);
        // //
        // // console.log(box1DistanceToWorldOrigin);
        //
        // if (isArrowUp) {
        //     box1.position.z -= .5;
        // } else if (isArrowDown) {
        //     box1.position.z += .5;
        // } else if (isArrowRight) {
        //     box1.position.x += .5;
        // } else if (isArrowLeft) {
        //     box1.position.x -= .5;
        // }
        //
        // if (isDigit1) {
        //
        //     box1.lookAt(box2.position);
        //     // console.log();
        //
        //     // let subVector = new THREE.Vector3();
        //     // subVector = subVector.subVectors(box1.position, box2.position);
        //     // console.log(subVector.length());
        //     // let subVector = new THREE.Vector3();
        //     // subVector = subVector.subVectors(box1.rotation, box2.rotation);
        //     // let distance = subVector.length();
        //     // let direction = subVector.normalize();
        //     // if (distance > 0.3) {
        //     //     box1.rotation.x = box1.rotation.x - (direction.x * .1);
        //     //     box1.rotation.y = box1.rotation.y - (direction.y * .1);
        //     //     box1.rotation.z = box1.rotation.z - (direction.z * .1);
        //     // }
        //     // console.log(box1.rotation);
        //     // box1.lookAt(box2.position);
        //
        //     // console.log(box1.position);
        //
        //     // goToVector(box1, box2);
        // } else if (isDigit2) {
        //     // console.log(box1.rotation);
        //     box1.lookAt(box3.position);
        //     // goToVector(box1, box3);
        // }
        //
        // if (isSpace) {
        //     box1.position.y += 1.5;
        //     if (box1.position.y === 20) {
        //         isSpace = false;
        //     }
        // } else if (box1.position.y > 5) {
        //     box1.position.y -= 1.5;
        // }
        //
        //
        // let speed = .05;

        // console.log(box1.rotation);
        controls.update();
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(event) {
        event.preventDefault();
        // mouseVector.x = (event.clientX / window.innerWidth);
        // mouseVector.y = -(event.clientY / window.innerHeight);
        // mouseVector.z =
        mouseVector.x = (event.clientX / window.innerWidth);
        mouseVector.y = -(event.clientY / window.innerHeight);
    }
}