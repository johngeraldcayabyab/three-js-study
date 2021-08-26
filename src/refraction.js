import "../style.css";
import * as THREE from "three";
import {Refractor} from "three/examples/jsm/objects/Refractor.js";
import {WaterRefractionShader} from "three/examples/jsm/shaders/WaterRefractionShader.js";
import {createRenderer} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createScene} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";

main();

function main() {
    let renderer, camera, scene, controls, stats;

    let clock, planeRefractor;

    init();
    animate();

    function init() {
        camera = createPerspectiveCamera(camera, {x: 10, y: 10, z : 10});
        scene = createScene(scene);
        stats = createStats(stats);

        clock = new THREE.Clock();


        const torusKnotGeometry = new THREE.TorusKnotGeometry(3, 1, 256, 32);
        const torusKnotMaterial = new THREE.MeshStandardMaterial({color: 0x6083c2});
        const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
        scene.add(torusKnotMesh);

        // const


        const planeRefractorGeometry = new THREE.PlaneGeometry(10, 10);

        planeRefractor = new Refractor(planeRefractorGeometry, {
            color: 0x999999,
            textureWidth: 1024,
            textureHeight: 1024,
            shader: WaterRefractionShader
        });

        planeRefractor.position.set(0, 0, 5);
        scene.add(planeRefractor);

        const dudvMap = new THREE.TextureLoader().load('../src/textures/waterdudv.jpg', function () {
            animate();
        });

        dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
        planeRefractor.material.uniforms["tDudv"].value = dudvMap;


        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);
        scene.add(camera);

        renderer = createRenderer(renderer);
        controls = createControls(controls, camera, renderer);
        window.addEventListener('resize', onWindowResize)
    }

    function animate() {
        render();
        requestAnimationFrame(animate);
    }

    function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }


    function render() {
        stats.update();
        planeRefractor.material.uniforms['time'].value += clock.getDelta();
        renderer.render(scene, camera);
    }
}