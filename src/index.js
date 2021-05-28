import * as THREE from 'three';
import Stats from 'stats.js';
import {SimplexNoise} from "./SimplexNoise";
import {GUI} from "dat.gui";
import {GPUComputationRenderer} from "three/examples/jsm/misc/GPUComputationRenderer";
import {desktopFOV} from "./FIeldOfViews";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
//
// let simplex = new SimplexNoise();
//
// const waterMaxHeight = 10;
//
// function noise(x, y) {
//     let multR = waterMaxHeight;
//     let mult = 0.025;
//     let r = 0;
//     for (let i = 0; i < 15; i++) {
//         r += multR * simplex.noise(x * mult, y * mult);
//         multR *= 0.53 + 0.025 * i;
//         mult *= 1.25;
//     }
//     return r;
// }
//
// console.log(noise.noise(20, 30));
//

function main() {

    let container, stats, camera, scene, renderer, controls;

    const clock = new THREE.Clock();
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;


    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(desktopFOV(), windowInnerWidth / windowInnerHeight, 1, 40000);
        camera.position.z = 250;
        camera.lookAt(0, 0, 0);

        scene = new THREE.Scene();
        scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
        scene.fog = new THREE.Fog(scene.background, 1, 40000)

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(windowInnerWidth, windowInnerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;



        container.appendChild(renderer.domElement);

        // const canvas = renderer.domElement;
        // // console.log(canvas);
        // const ctx = canvas.getContext('3d');
        // console.log(ctx );
        // // ctx.fillStyle = 'green';
        // // ctx.fillRect(10, 10, 100, 100);



        controls = new OrbitControls(camera, renderer.domElement);

        scene.add(createPlane());

        stats = new Stats();
        container.appendChild(stats.dom);
        window.addEventListener('resize', onWindowResize);
    }

    function createLine(){
        const material = new THREE.LineBasicMaterial({color : 0xEDFF9A});
        const points  = [];
        points.push(new THREE.Vector3(10, 0, 0));
        points.push(new THREE.Vector3(50, 0, 0));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return new THREE.Line(geometry, material);
    }

    function createPlane(){
        const geometry = new THREE.PlaneGeometry( 500, 500 );
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        return new THREE.Mesh( geometry, material );
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function onWindowResize() {
        renderer.setSize(windowInnerWidth, windowInnerHeight);
        camera.aspect = windowInnerWidth / windowInnerHeight;
        camera.updateProjectionMatrix();
    }

    function render() {
        const delta = clock.getDelta();
        controls.update(delta);
        renderer.render(scene, camera);
    }
}

main();


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
ctx.fillRect(10, 10, 100, 100);