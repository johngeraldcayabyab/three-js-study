import * as THREE from 'three';
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import Stats from 'stats.js';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {SimplexNoise} from "./SimplexNoise";


const WIDTH = 128;

const BOUNDS = 512;
const BOUNDS_HALF = BOUNDS * 0.5;

let container, stats;
let camera, scene, renderer;
let mouseMoved = false;
const mouseCoords = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

let waterMesh;
let meshRay;
let gpuCompute;
let heightmapVariable;
let waterUniforms;
let smoothShader;
let readWaterLevelShader;
let readWaterLevelRenderTarget;
let readWaterLevelImage;
const waterNormal = new THREE.Vector3();

const NUM_SPHERES = 5;
const spheres = [];
let spheresEnabled = true;

const simplex = new SimplexNoise();

function init() {

}

function initWater() {

}

function isSafari() {

}

function fillTexture(texture) {

}

function smoothWater() {

}

function createSpheres() {

}

function sphereDynamics() {

}

function onWindowResize() {

}

function setMouseCoords(x, y) {

}

function onPointerMove(event) {

}

function animate() {

}

function render(){

}