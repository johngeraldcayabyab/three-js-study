import * as THREE from 'three';

let container, stats;
let camera, controls, scene, renderer;
let pickingTexture, pickingScene;
let highlightBox;

const pickingData = [];

const pointer = new THREE.Vector2();

function init() {

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
