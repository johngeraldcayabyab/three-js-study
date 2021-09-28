import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {GUI} from "three/examples/jsm/libs/dat.gui.module.js";

main();

let main = () => {
    const renderer = new THREE.WebGLRenderer({antialias: true});
    const gui = new GUI();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(200, 500, 300);
    scene.add(directionalLight);

    const fov = 75;
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;
    const near = 0.1;
    const far = 5000;

    const camera = new THREE.PerspectiveCamera(fov, windowInnerWidth / windowInnerHeight, near, far);
    camera.position.set(150, 150, 150);
    camera.lookAt(0, 10, 0);

    const controls = new OrbitControls(camera, renderer.domElement);

    let createPlane = () => {
        const geometry = new THREE.PlaneGeometry(500, 500, 32);
        const material = new THREE.MeshLambertMaterial({color: 0x6584b5, side: THREE.DoubleSide});
        return new THREE.Mesh(geometry, material);
    };

    const plane = createPlane();
    plane.rotation.x = 300;
    scene.add(plane);

    let createWheels = () => {
        const geometry = new THREE.BoxBufferGeometry(12, 12, 33);
        const material = new THREE.MeshLambertMaterial({color: 0x333333});
        return new THREE.Mesh(geometry, material);
    };

    let createCar = () => {
        const car = new THREE.Group();
        car.position.y = 1;

        const backWheel = createWheels();
        backWheel.position.y = 6;
        backWheel.position.x = -18;
        car.add(backWheel);


        const frontWheel = createWheels();
        frontWheel.position.y = 6;
        frontWheel.position.x = 18;
        car.add(frontWheel);

        const roof = new THREE.Mesh(
            new THREE.BoxBufferGeometry(60, 15, 30),
            new THREE.MeshLambertMaterial({color: 0x78b14b})
        );
        roof.position.y = 12;
        car.add(roof);

        const cabin = new THREE.Mesh(
            new THREE.BoxBufferGeometry(33, 12, 30),
            new THREE.MeshLambertMaterial({color: 0xffffff})
        );
        cabin.position.x = -5;
        cabin.position.y = 25;
        car.add(cabin);

        makeAxisGrid(gui, backWheel, 'backWheel');
        makeAxisGrid(gui, roof, 'roof');
        makeAxisGrid(gui, cabin, 'cabin');
        makeAxisGrid(gui, frontWheel, 'frontWheel');

        return car;
    };

    const car = createCar();
    scene.add(car);

    makeAxisGrid(gui, car, 'car');
    makeAxisGrid(gui, plane, 'plane');

    function goLeft() {
        car.position.z -= 1;
        car.rotation.y = 1.5;
    }

    function goRight() {
        car.position.z += 1;
        car.rotation.y = -1.5;
    }

    function goForward() {
        car.position.x += 1;
        car.rotation.y = 0;
    }

    function goBackward() {
        car.position.x -= 1;
        car.rotation.y = -3;
    }

    function gridNoise(x, z, seed) {
        var n = (1619 * x + 31337 * z + 1013 * seed) & 0x7fffffff;
        n = BigInt((n >> 13) ^ n);
        n = n * (n * n * 60493n + 19990303n) + 1376312589n;
        n = parseInt(n.toString(2).slice(-31), 2);
        return 1 - n / 1073741824;
    }

    // function test() {
    //     for (var i = 10000; i < 11000; i++) {
    //         console.log(gridNoise(0, 0, i));
    //     }
    // }
    // test();


    let animate = (time) => {

        time *= 0.001;

        // goForward();
        // console.log(time);

        let randomNumber = gridNoise(car.position.x, car.position.y, time);

        console.log(randomNumber);

        // if(randomNumber === 1){
        //     goForward();
        // }else if(randomNumber === 2){
        //     goRight();
        // }else if(randomNumber === 3){
        //     goBackward();
        // }else if(randomNumber === 4){
        //     goLeft();
        // }


        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate)

    // animate();
}