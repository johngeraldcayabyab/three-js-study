import * as THREE from 'three/src/Three.js';
import {createContainer, createRenderer, onWindowResize} from "./helpers";
import {GeometryUtils} from "three/examples/jsm/utils/GeometryUtils";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from '../node_modules/stats.js/src/Stats.js';


main();

function main() {

    let container, renderer, scene, camera, controls, stats, INTERSECTED, line;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

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

        container.addEventListener('pointermove', onPointerMove);
        stats = new Stats();
        container.appendChild(stats.dom);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function onPointerMove(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function createPlane() {
        const geometry = new THREE.PlaneGeometry(7500, 7500, 256 - 1, 256 - 1);
        geometry.rotateX(-Math.PI / 2);
        const material = new THREE.MeshPhongMaterial({color: 0xbfd1e5, side: THREE.DoubleSide});
        return new THREE.Mesh(geometry, material);
    }

    function findIntersections() {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            // if (INTERSECTED !== intersects[0].object) {
            //     if (INTERSECTED) {
            //         INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
            //     }
            //     INTERSECTED = intersects[0].object;
            //     INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            //     INTERSECTED.material.emissive.setHex(0xff0000);
            // }
        }
    }

    function render() {
        findIntersections();
        renderer.render(scene, camera);
    }

}

