import * as THREE from 'three';
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import Stats from 'stats.js';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {SimplexNoise} from "./SimplexNoise";
import {GUI} from "dat.gui";


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
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.set(0, 200, 350);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    const sun = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    sun.position.set(300, 400, 175);
    scene.add(sun);

    const sun2 = new THREE.DirectionalLight(0x40A040, 0.6);
    sun2.position.set(-100, 350, -200);
    scene.add(sun2);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    container.style.touchAction = 'none';
    container.addEventListener('pointermove', onPointerMove);

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 87) {
            waterMesh.material.wireframe = !waterMesh.material.wireframe;
            waterMesh.material.needsUpdate = true;
        }
    });

    window.addEventListener('resize', onWindowResize);

    const gui = new GUI();

    const effectController = {
        mouseSize: 20.0,
        viscosity: 0.98,
        spheresEnabled: spheresEnabled
    };

    const valuesChanger = function () {
        heightmapVariable.material.uniforms['mouseSize'].value = effectController.mouseSize;
        heightmapVariable.material.uniforms['viscosityConstant'].value = effectController.viscosity;
        spheresEnabled = effectController.spheresEnabled;
        for (let i = 0; i < NUM_SPHERES; i++) {
            if (spheres[i]) {
                spheres[i].visible = spheresEnabled;
            }
        }
    };

    gui.add(effectController, 'mouseSize', 1.0, 100.0, 1.0).onChange(valuesChanger);
    gui.add(effectController, 'viscosity', 0.9, 0.999, 0.001).onChange(valuesChanger);
    gui.add(effectController, 'spheresEnabled', 0, 1, 1).onChange(valuesChanger);

    const buttonSmooth = {
        smoothWater: function () {
            smoothWater();
        }
    };

    gui.add(buttonSmooth, 'smoothWater');

    initWater();

    createSpheres();

    valuesChanger();
}

function initWater() {
    const materialColor = 0x0040C0;

    const geometry = new THREE.PlaneGeometry(BOUNDS, BOUNDS, WIDTH, -1, WIDTH - 1);

    const material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
            THREE.ShaderLib['phong'].uniforms,
            {
                'heightMap': {value: null}
            }
        ]),
        vertexShader: document.getElementById('waterVertexShader').textContent,
        fragmentShader: THREE.ShaderChunk['meshphong_frag']
    });

    material.lights = true;

    material.color = new THREE.Color(materialColor);
    material.specular = new THREE.Color(0x111111);
    material.shininess = 50;

    material.uniforms['diffuse'].value = material.color;
    material.uniforms['specular'].value = material.specular;
    material.uniforms['shininess'].value = Math.max(material.shininess, 1e-4);
    material.uniforms['opacity'].value = material.opacity;

    material.defines.WIDTH = WIDTH.toFixed(1);
    material.defines.BOUNDS = BOUNDS.toFixed(1);

    waterUniforms = material.uniforms;

    waterMesh = new THREE.Mesh(geometry, material);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.matrixAutoUpdate = false;
    waterMesh.updateMatrix();

    scene.add(waterMesh);
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

function render() {

}