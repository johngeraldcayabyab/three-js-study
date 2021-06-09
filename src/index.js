// noinspection JSVoidFunctionReturnValueUsed

import * as THREE from 'three/src/Three';
import {createContainer, createRenderer, onWindowResize} from "./helpers";
import {GUI} from "dat.gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from 'stats.js';

main();

function main() {

    let container, renderer, scene, camera, controls, stats;

    let mesh;
    const amount = parseInt(window.location.search.substr(1)) || 10;
    const count = Math.pow(amount, 3);


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(1, 1);

    const color = new THREE.Color();

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0, 1, 2000);
        camera.position.set(amount, amount, amount);
        camera.lookAt(0, 0, 0);

        scene = new THREE.Scene();

        const light1 = new THREE.HemisphereLight(0xffffff, 0x000088);
        light1.position.set(-1, 1.5, 1);
        scene.add(light1);

        const light2 = new THREE.HemisphereLight(0xffffff, 0x880000, 0.5);
        light2.position.set(-1, -1.5, -1);
        scene.add(light2);

        const geometry = new THREE.IcosahedronGeometry(0.5, 3);
        const material = new THREE.MeshPhongMaterial();


        mesh = new THREE.InstancedMesh(geometry, material, count);

        let i = 0;
        const offset = (amount - 1) / 2;

        const matrix = new THREE.Matrix4();

        for (let x = 0; x < amount; x++) {
            for (let y = 0; y < amount; y++) {
                for (let z = 0; z < amount; z++) {
                    matrix.setPosition(offset - x, offset - y, offset - z);
                    mesh.setMatrixAt(i, matrix);
                    mesh.setColorAt(i, color);
                    i++;
                }
            }
        }

        scene.add(mesh);

        const gui = new GUI();
        gui.add(mesh, 'count', 0, count);

        new OrbitControls(camera, renderer.domElement);

        stats = new Stats();
        document.body.appendChild(stats.dom);

        window.addEventListener('resize', onWindowResize(renderer, camera));
        document.addEventListener('mousemove', onMouseMove)
    }

    function animate(time) {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        raycaster.setFromCamera(mouse, camera);
        const intersection = raycaster.intersectObjects(mesh);

        if (intersection.length > 0) {
            const instanceId = intersection[0].instanceId;

            mesh.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));
            mesh.instanceColor.needsUpdate = true;
        }
    }


    function onMouseMove(event) {
        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    }
}

