import * as THREE from "three";
import {createRenderer} from "../utils/scaffold.js";
import {createScene} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";

main();

function main() {
    let renderer, scene, camera, controls, stats;

    init();
    animate();

    function init() {
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 5, y: 5, z: 20});
        stats = createStats(stats);

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 0, 1);
        scene.add(light);


        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;

        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0.1, 'rgba(210, 210,210, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const shadowTexture = new THREE.CanvasTexture(canvas);

        const shadowMaterial = new THREE.MeshBasicMaterial({map: shadowTexture});
        const shadowGeo = new THREE.PlaneGeometry(300, 300, 1, 1);

        let shadowMesh;

        shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
        shadowMesh.position.y = -250;
        shadowMesh.rotation.x = -Math.PI / 2;
        scene.add(shadowMesh);

        shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
        shadowMesh.position.y = -250;
        shadowMesh.position.x = -400;
        shadowMesh.rotation.x = -Math.PI / 2;
        scene.add(shadowMesh);


        shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
        shadowMesh.position.y = -250;
        shadowMesh.position.x = 400;
        shadowMesh.rotation.x = -Math.PI / 2;
        scene.add(shadowMesh);

        const radius = 200;

        const geometry1 = new THREE.IcosahedronGeometry(radius, 1);

        const count = geometry1.attributes.position.count;
        geometry1.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

        const geometry2 = geometry1.clone();
        const geometry3 = geometry1.clone();

        const color = new THREE.Color();
        const position1 = geometry1.attributes.position;
        const position2 = geometry2.attributes.position;
        const position3 = geometry3.attributes.position;
        const colors1 = geometry1.attributes.color;
        const colors2 = geometry2.attributes.color;
        const colors3 = geometry3.attributes.color;

        for (let i = 0; i < count; i++) {
            color.setHSL((position1.getY(i) / radius + 1) / 2, 1.0, 0.5);
            colors1.setXYZ(i, color.r, color.g, color.b);

            color.setHSL(0, (position2.getY(i) / radius + 1) / 2, 0.5);
            colors2.setXYZ(i, color.r, color.g, color.b);

            color.setRGB(1, 1.08 - (position3.getY(i) / radius + 1) / 2, 0);
            colors3.setXYZ(i, color.r, color.g, color.b);
        }

        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            flatShading: true,
            vertexColors: true,
            shininess: 0
        });

        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
            transparent: true
        });

        let mesh = new THREE.Mesh(geometry1, material);
        let wireframe = new THREE.Mesh(geometry1, wireframeMaterial);
        mesh.add(wireframe);
        mesh.position.x = -400;
        mesh.rotation.x = -1.87;
        scene.add(mesh);

        mesh = new THREE.Mesh(geometry2, material);
        wireframe = new THREE.Mesh(geometry2, wireframeMaterial);
        mesh.add(wireframe);
        scene.add(mesh);


        mesh = new THREE.Mesh(geometry3, material);
        wireframe = new THREE.Mesh(geometry3, wireframeMaterial);
        mesh.position.x = 400;
        mesh.add(wireframe);
        scene.add(mesh);

        renderer = createRenderer(renderer);
        controls = createControls(controls, camera, renderer);
        window.addEventListener('resize', onWindowResize);
    }


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        render();
        stats.update();
        requestAnimationFrame(animate);
    }

    function render() {
        controls.update();
        renderer.render(scene, camera);
    }
}