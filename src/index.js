import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

let main = () => {

    const renderer = new THREE.WebGLRenderer({antialias: true});
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
            new THREE.BoxBufferGeometry(33, 12, 24),
            new THREE.MeshLambertMaterial({color: 0xffffff})
        );
        cabin.position.x = -5;
        cabin.position.y = 25;
        car.add(cabin);

        return car;
    };

    const car = createCar();
    scene.add(car);

    let forward = true;

    car.rotation.y += 1;

    let animate = () => {



        if(forward){
            car.position.x += 1;
            // car.position.z += 1;

        }else{
            car.position.x -= 1;
        }


        if(car.position.x === (250 - 24)){
            forward = false;
        }else if(car.position.x === (-250 + 24)){
            forward = true;
        }


        // car.rotation.y += .01;
        // car.position.z += .1;
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();
}

main();