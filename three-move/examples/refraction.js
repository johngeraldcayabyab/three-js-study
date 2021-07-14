import * as THREE from 'three';
import {
    createContainer,
    createControls,
    createPerspectiveCamera,
    createRenderer,
    createScene,
    createStats
} from "./helpers";
import {Refractor} from "three/examples/jsm/objects/Refractor";
import {WaterRefractionShader} from "three/examples/jsm/shaders/WaterRefractionShader";

main();

function main() {
    let container, renderer, camera, scene, controls, stats;

    let clock, planeRefractor;

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        camera = createPerspectiveCamera(camera, {x: 10, y: 10, z : 10});
        scene = createScene(scene);
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats, container);

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

        const dudvMap = new THREE.TextureLoader().load('textures/waterdudv.jpg', function () {
            animate();
        });

        dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
        planeRefractor.material.uniforms["tDudv"].value = dudvMap;


        // alert('chimay');

        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);
        scene.add(camera);

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