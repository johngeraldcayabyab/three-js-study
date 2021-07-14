import * as THREE from 'three/src/Three.js';
import {createContainer, createRenderer, onWindowResize} from "./helpers";
import {GeometryUtils} from "three/examples/jsm/utils/GeometryUtils";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from 'stats.js/src/Stats.js';


main();

function main() {
    let container, renderer, scene, camera, controls, stats, line;

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);

        scene = new THREE.Scene();
        scene.background = '#000';

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
        camera.lookAt(0, 0, 0);
        camera.position.y = 10;
        camera.position.z = 10;

        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        const points = GeometryUtils.gosper(7);
        const geometry = new THREE.BufferGeometry();
        const positionAttribute = new THREE.Float32BufferAttribute(points, 3);
        geometry.setAttribute('position', positionAttribute);
        geometry.center();

        const colorAttribute = new THREE.BufferAttribute(new Float32Array(positionAttribute.array.length), 3);
        colorAttribute.setUsage(THREE.DynamicDrawUsage);
        geometry.setAttribute('color', colorAttribute);

        const material = new THREE.LineBasicMaterial({color: 0xffffff});

        line = new THREE.Line(geometry, material);
        line.scale.setScalar(0.05);
        scene.add(line);

        stats = new Stats();
        container.appendChild(stats.dom);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function render() {
        renderer.render(scene, camera);
    }
}

