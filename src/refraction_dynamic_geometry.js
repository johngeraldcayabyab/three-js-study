import "../style.css";
import * as THREE from 'three';
import {createRenderer} from "../utils/scaffold.js";
import {createScene} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";
import {Refractor} from "three/examples/jsm/objects/Refractor.js";
import {WaterRefractionShader} from "three/examples/jsm/shaders/WaterRefractionShader.js";

main();

function main() {

    let renderer, scene, camera, controls, stats;

    let waterMesh, waterGeometry, waterMaterial, clock, planeRefractor, waterRefractor;

    const worldWidth = 128, worldDepth = 128;


    init();
    animate();

    function init() {
        
        renderer = createRenderer(renderer);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera);
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats);
        clock = new THREE.Clock();

        const torusKnotGeometry = new THREE.TorusKnotGeometry(300, 90, 256, 32);
        const torusKnotMaterial = new THREE.MeshStandardMaterial({color: 0x6083c2});
        const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
        torusKnotMesh.position.y = -500;
        scene.add(torusKnotMesh);

        waterGeometry = new THREE.PlaneGeometry(20000, 20000, worldWidth - 1, worldDepth - 1);
        waterGeometry.rotateX(-Math.PI / 2);

        const position = waterGeometry.attributes.position;
        position.usage = THREE.DynamicDrawUsage;

        for (let i = 0; i < position.count; i++) {
            const y = 100 * Math.sin(i / 2);
            position.setY(i, y);
        }

        waterRefractor = new Refractor(waterGeometry, {
            color: 0x999999,
            textureWidth: 1024,
            textureHeight: 1024,
            shader: WaterRefractionShader
        });

        const dudvMap = new THREE.TextureLoader().load('../src/textures/waternormals.jpg', function () {
            animate();
        });

        dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
        dudvMap.repeat.set(5, 5);
        waterRefractor.material.uniforms["tDudv"].value = dudvMap;

        waterMaterial = new THREE.MeshBasicMaterial({color: 0x0044ff, map: dudvMap});
        scene.add(waterRefractor);

        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);
        scene.add(camera);

        container.addEventListener('resize', onWindowResize);
    }

    function animate() {
        render();
        requestAnimationFrame(animate);
    }

    function render() {
        const delta = clock.getDelta();
        const time = clock.getElapsedTime() * 10;

        const waterPosition = waterGeometry.attributes.position;



        for (let i = 0; i < waterPosition.count; i++) {
            const y = 100 * Math.sin(i / 5 + (time + i) / 7);
            waterPosition.setY(i, y);
        }

        waterPosition.needsUpdate = true;
        controls.update(delta);

        stats.update();
        renderer.render(scene, camera);
    }

    function onMouseMove() {

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
