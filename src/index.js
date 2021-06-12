import * as THREE from 'three/src/Three.js';
import {createContainer, createRenderer} from "./helpers";
import {GeometryUtils} from "three/examples/jsm/utils/GeometryUtils";

main();

function main() {

    let container, renderer, scene, camera;
    let line, sprite, texture;
    let cameraOrtho, sceneOrtho;
    let offset = 0;

    const dpr = window.devicePixelRatio;

    const textureSize = 128 * dpr;
    const vector = new THREE.Vector2();
    const color = new THREE.Color();

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);

        const width = window.innerWidth;
        const height = window.innerHeight;

        camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000);
        camera.position.z = 20;

        cameraOrtho = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 10);
        cameraOrtho.position.z = 10;

        scene = new THREE.Scene();
        sceneOrtho = new THREE.Scene();

        const points = GeometryUtils.gosper(8);
    }

    function animate() {

    }
}

