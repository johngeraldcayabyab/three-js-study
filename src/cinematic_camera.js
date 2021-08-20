import "../style.css";
import * as THREE from "three";
import {CinematicCamera} from "three/examples/jsm/cameras/CinematicCamera.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import {GUI} from "three/examples/jsm/libs/dat.gui.module.js";

let camera, scene, raycaster, renderer, stats;

const mouse = new THREE.Vector2();
let INTERSECTED;
const radius = 100;
let theta = 0;

init();
animate();

function init() {
    camera = new CinematicCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.setLens(5);
    camera.position.set(2, 1, 500);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const light = new THREE.DirectionalLight(0xffffff, 0.35);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    const geometry = new THREE.BoxGeometry(20, 20, 20);

    for (let i = 0; i < 100; i++) {
        const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));

        object.position.x = Math.random() * 800 - 400;
        object.position.y = Math.random() * 800 - 400;
        object.position.z = Math.random() * 800 - 400;

        scene.add(object);
    }

    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    document.addEventListener('mousemove', onDocumentMouseMove);

    window.addEventListener('resize', onWindowResize);

    const effectController = {
        focalLength: 15,
        fstop: 2.8,
        showFocus: false,
        focalDepth: 3,
    };

    const matChanger = function () {
        for (const e in effectController) {
            if (e in camera.postprocessing.bokeh_uniforms) {
                camera.postprocessing.bokeh_uniforms[e].value = effectController[e];
            }
        }

        camera.postprocessing.bokeh_uniforms['znear'].value = camera.near;
        camera.postprocessing.bokeh_uniforms['zfar'].value = camera.far;
        camera.setLens(effectController.focalLength, camera.frameHeight, effectController.fstop, camera.coc);
        effectController['focalDepth'] = camera.postprocessing.bokeh_uniforms['focalDepth'].value;
    };

    const gui = new GUI;

    gui.add(effectController, 'focalLength', 1, 135, 0.01).onChange(matChanger);
    gui.add(effectController, 'fstop', 1.8, 22, 0.01).onChange(matChanger);
    gui.add(effectController, 'focalDepth', 0.1, 100, 0.001).onChange(matChanger);
    gui.add(effectController, 'showFocus', true).onChange(matChanger);

    matChanger();

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove() {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate, renderer.domElement);

    render();
    stats.update();
}

function render() {
    theta += 0.1;

    camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
    camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));

    camera.updateMatrixWorld();

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const targetDistance = intersects[0].distance;

        camera.focusAt(targetDistance);

        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
    }

    if (camera.postprocessing.enabled) {
        camera.renderCinematic(scene, renderer);
    } else {
        scene.overrideMaterial = null;

        renderer.clear();
        renderer.render(scene, camera);
    }
}