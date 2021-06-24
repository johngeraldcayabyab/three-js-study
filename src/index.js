import * as THREE from 'three';
import {createContainer, createRenderer, createStats} from "./helpers";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


main();

function main() {

    let container, renderer, scene, camera, controls, stats;

    let mesh, geometry, material, clock;

    const worldWidth = 128, worldDepth = 128;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        stats = createStats(stats, container);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
        camera.position.y = 1000;
        camera.position.z = 1000;
        // camera.P.z = 600;

        controls = new OrbitControls(camera, renderer.domElement);
        // controls.update();

        clock = new THREE.Clock();

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xaaccff);
        // scene.fog = new THREE.FogExp2(0xaaccff, 0.0007);

        geometry = new THREE.PlaneGeometry(20000, 20000, worldWidth - 1, worldDepth - 1);
        geometry.rotateX(-Math.PI / 2);

        const position = geometry.attributes.position;
        position.usage = THREE.DynamicDrawUsage;

        for (let i = 0; i < position.count; i++) {
            const y = 100 * Math.sin(i / 2);
            position.setY(i, y);
        }

        const texture = new THREE.TextureLoader().load('textures/realisticwater.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);

        material = new THREE.MeshBasicMaterial({color: 0x0044ff, map: texture});

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        container.addEventListener('resize', onWindowResize);
    }

    function render() {

        const delta = clock.getDelta();
        const time = clock.getElapsedTime() * 10;

        const position = geometry.attributes.position;

        for (let i = 0; i < position.count; i++) {
            const y = 100 * Math.sin(i / 5 + (time + i) / 7);
            position.setY(i, y);
        }

        position.needsUpdate = true;
        controls.update(delta);
        renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function onMouseMove(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = (event.clientY / window.innerHeight) * 2 + 1;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

}