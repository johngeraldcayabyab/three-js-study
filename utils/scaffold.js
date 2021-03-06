import * as THREE from "three";
import {desktopFOV} from "./field_of_views.js";
import {OrbitControls} from "three/examples/jsm/controls/experimental/CameraControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {ImprovedNoise} from "three/examples/jsm/math/ImprovedNoise.js";

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

export const createStats = (stats) => {
    stats = new Stats();
    stats.dom.setAttribute('id', 'stats');
    document.body.appendChild(stats.dom);
    return stats;
};

export const createRenderer = (renderer) => {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x20252f);
    document.body.appendChild(renderer.domElement);
    return renderer;
};

export const createControls = (controls, camera, renderer) => {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    return controls;
};


export const onWindowResize = (renderer, camera) => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    return true;
};

export const generateHeight = (width, height) => {
    const size = width * height, data = new Uint8Array(size),
        perlin = new ImprovedNoise(), z = Math.random() * 100;
    let quality = 1;
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < size; i++) {
            const x = i % width, y = ~~(i / width);
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
        }
        quality *= 5;
    }
    return data;
}

export const generateTexture = (data, width, height) => {
    let context, image, imageData, shade;

    const vector3 = new THREE.Vector3(0, 0, 0);
    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
        vector3.x = data[j = 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();
        shade = vector3.dot(sun);
        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);
    }

    context.putImageData(image, 0, 0);

    const canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i += 4) {
        const v = ~~(Math.random() * 5);
        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;
    }
    context.putImageData(image, 0, 0);
    return canvasScaled;
}