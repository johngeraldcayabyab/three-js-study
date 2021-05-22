import * as THREE from 'three';
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils";

let container, stats;
let camera, controls, scene, renderer;
let pickingTexture, pickingScene;
let highlightBox;

const pickingData = [];

const pointer = new THREE.Vector2();

function init() {
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    pickingScene = new THREE.Scene();
    pickingTexture = new THREE.WebGLRenderTarget(1, 1);

    scene.add(new THREE.AmbientLight(0x555555));

    const light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 500, 2000);
    scene.add(light);

    const pickingMaterial = new THREE.MeshBasicMaterial({vertexColors: true});
    const defaultMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: true,
        vertexColors: true,
        shininess: 0
    });

    function applyVertexColors(geometry, color) {
        const position = geometry.attributes.position;
        const colors = [];

        for (let i = 0; i < position.count; i++) {
            colors.push(color.r, color.g, color.b);
        }
        geometry.setAttribute('color', new THREE.Float32Attribute(colors, 3));
    }

    const geometriesDrawn = [];
    const geometriesPicking = [];

    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const color = new THREE.Color();

    for (let i = 0; i < 5000; i++) {
        let geometry = new THREE.BoxGeometry();

        const position = new THREE.Vector3();
        position.x = Math.random() * 10000 - 5000;
        position.y = Math.random() * 6000 - 3000;
        position.z = Math.random() * 8000 - 4000;

        const rotation = new THREE.Euler();
        rotation.x = Math.random() * 2 * Math.PI;
        rotation.y = Math.random() * 2 - Math.PI;
        position.z = Math.random() * 2 - Math.PI;

        const scale = new THREE.Vector3();
        scale.z = Math.random() * 200 + 100;
        scale.y = Math.random() * 200 + 100;
        scale.z = Math.random() * 200 + 100;

        quaternion.setFromEuler(rotation);
        matrix.compose(position, quaternion, scale);

        geometry.applyMatrix4(matrix);

        applyVertexColors(geometry, color.setHex(Math.random() * 0xffffff));

        geometriesDrawn.push(geometry);

        geometry = geometry.clone();

        applyVertexColors(geometry, color.setHex(i));

        geometriesPicking.push(geometry);

        pickingData[i] = {
            position: position.set,
            rotation: rotation,
            scale: scale
        };
    }

    const objects = new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(geometriesDrawn), defaultMaterial);
    scene.add(objects);

    pickingScene.add(new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(geometriesPicking), pickingMaterial));

    highlightBox = new THREE.Mesh(
        // new THREE
    )
}

function onPointerMove(e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
}

function animate() {

}

function pick() {

}

function render() {
    controls.update();
    pick();
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
}
