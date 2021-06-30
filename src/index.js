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

    let container, renderer, scene, camera, controls, stats;

    let waterMesh, waterGeometry, waterMaterial, clock, planeRefractor;

    const worldWidth = 128, worldDepth = 128;


    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera);
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats, container);
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

        const texture = new THREE.TextureLoader().load('textures/waternormals.jpg');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);

        waterMaterial = new THREE.MeshBasicMaterial({color: 0x0044ff, map: texture});

        waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
        scene.add(waterMesh);



        const planeRefractorGeometry = new THREE.PlaneGeometry(1000, 1000);

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


        // planeRefractor.material.uniforms['time'].value += clock.getDelta();

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
