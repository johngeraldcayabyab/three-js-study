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
    let renderer, scene, camera, controls, stats;
    let randomX = getRandomPositiveOrNegative(.5);
    let randomY = getRandomPositiveOrNegative(.5);
    let randomZ = getRandomPositiveOrNegative(.5);
    let balls = [];

    init();
    animate();

    function init() {
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 1000, y: 1000, z: 1000});
        stats = createStats(stats);

        // let light = new THREE.PointLight(0xff0000, 1, 100);
        // light.position.set(100 ,50, 50);
        // scene.add(light);

        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(-300, 200, 100);
        scene.add(spotLight);

        const spotLight2 = new THREE.SpotLight(0xffffff);
        spotLight2.position.set(300, 200, 0);
        scene.add(spotLight2);
        // const spotLightHelper = new THREE.SpotLightHelper( spotLight );
        // scene.add( spotLightHelper );


        for (let i = 0; i < 100; i++) {
            let sphereGeometry = new THREE.SphereGeometry(25, 25, 25);
            let sphereMaterial = new THREE.MeshPhongMaterial();
            let sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphereMesh.position.set(getRandomArbitrary(1, 1000), getRandomArbitrary(1, 1000), getRandomArbitrary(1, 1000));
            scene.add(sphereMesh);
            balls.push(sphereMesh);
        }

        renderer = createRenderer(renderer);
        controls = createControls(controls, camera, renderer);
        window.addEventListener('resize', onWindowResize);
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getRandomPositiveOrNegative(val) {
        return Math.random() < 0.5 ? -(val) : val;
    }


    function animate() {


        balls.forEach(ball => {
            let ballPosition = ball.position;


            if (randomX > .1) {
                ballPosition.x += randomX;
            }else{
                ballPosition.x -= randomX;
            }

            if (randomY > .1) {
                ballPosition.y += randomY;
            }else{
                ballPosition.y -= randomY;
            }

            if (randomZ > .1) {
                ballPosition.z += randomZ;
            }else{
                ballPosition.z -= randomZ;
            }

            ball.position.set(ballPosition.x, ballPosition.y, ballPosition.z);
        });

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