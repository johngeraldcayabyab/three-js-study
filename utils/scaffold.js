import * as THREE from "../node_modules/three/build/three.module.js";
import {desktopFOV} from "./fieldOfViews.js";
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/experimental/CameraControls.js";
// import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
// import Stats from "../node_modules/three/examples/jsm/libs/stats.module.js";

export const createContainer = (container) => {
    container = document.createElement('div');
    document.body.appendChild(container);
    container.setAttribute('id', 'container');
    container = document.getElementById('container');
    container.innerHTML = '';
    return container;
};


export const createRenderer = (renderer, container) => {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0x20252f);
    container.appendChild(renderer.domElement);
    return renderer;
};

export const createScene = (scene) => {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x000000);
    return scene;
};

export const createPerspectiveCamera = (camera, position = {x: 0, y: 200, z: 200}) => {
    camera = new THREE.PerspectiveCamera(desktopFOV(), window.innerWidth / window.innerHeight, 0.1, 20000);
    camera.position.x = position.x;
    camera.position.y = position.y;
    camera.position.z = position.z;
    camera.lookAt(0, 0, 0);
    return camera;
};
//
// export const createStats = (stats, container) => {
//     stats = new Stats();
//     container.appendChild(stats.dom);
//     return stats;
// };

export const createControls = (controls, camera, renderer) => {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    return controls;
};
//
//
// export const onWindowResize = (renderer, camera) => {
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     return true;
// };