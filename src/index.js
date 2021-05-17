import * as THREE from 'three';
import Stats from 'stats.js';
import {GUI} from 'dat.gui';
import {GLTFLoaderF} from "three/examples/jsm/loaders/GLTFLoader";

let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
let camera, scene, renderer, model, face;

const api = {state: 'walking'};

init();
animate();

function init() {

    console.log(new THREE.Vector3(0, 2, 0));

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerHeight / window.innerHeight, 0.25, 100);
    camera.position.set(-5, 3, 10);
    camera.lookAt(new THREE.Vector3(0, 2, 0));

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e0e);
    scene.fog = new THREE.Fog(0x0e0e0e, 20, 100);

    clock = new THREE.Clock();

    const hemLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemLight.position.set(0, 20, 0);
    scene.add(hemLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 20, 10);

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false
    }));
    mesh.rotation.x = Math.PI / 2;
    scene.add(mesh);

    const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);
}

function animate() {

}