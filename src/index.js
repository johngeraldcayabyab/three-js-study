import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from 'stats.js/src/Stats';
import {createContainer, createRenderer} from "./helpers";
import interpret from "dat.gui/src/dat/color/interpret";


main();

function main() {

    let container, renderer, scene, camera, controls, stats;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // window.addEventListener('mousemove', onMouseMove, false);

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);

        scene = new THREE.Scene();
        // scene.background = new THREE.Color(0xbfd1e5);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
        camera.lookAt(0, 0, 0);
        camera.position.y = 7000;
        camera.position.z = 500;


        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();


        scene.add(createPlane());
        scene.add(createBox());


        // raycaster.setFromCamera(mouse, camera);
        // const intersects = raycaster.intersectObjects(scene.children);
        // for (let i = 0; i < intersects.length; i++) {
        //     console.log(intersects[i].object.material);
        //     // intersects[i].object.material.color.set(0xff0000);
        // }
        container.addEventListener('pointermove', onPointerMove);
        stats = new Stats();
        container.appendChild(stats.dom);

    }

    function createPlane() {
        const geometry = new THREE.PlaneGeometry(7500, 7500, 256 - 1, 256 - 1);
        geometry.rotateX(-Math.PI / 2);
        const material = new THREE.MeshBasicMaterial({color: 0xbfd1e5, side: THREE.DoubleSide});
        return new THREE.Mesh(geometry, material);
    }

    function createBox() {
        const geometry = new THREE.BoxGeometry(50, 50, 50);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        return new THREE.Mesh(geometry, material);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function onPointerMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );
        const intersects = raycaster.intersectObjects(scene.children);
        for (let i = 0; i < intersects.length; i++) {
            console.log(intersects[i].object.material);
            // intersects[i].object.material.color.set(0xff0000);
        }
    }

    function render() {
        renderer.render(scene, camera);
    }


}


