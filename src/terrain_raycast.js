import "../style.css";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {generateHeight, generateTexture} from "../utils/scaffold.js";

main();

function main() {
    let stats;

    let camera, controls, scene, renderer;

    let mesh, texture;

    const worldWidth = 256, worldDepth = 256, worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

    let helper;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    init();
    animate();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);
        container.setAttribute('id', 'container');
        container = document.getElementById('container');
        container.innerHTML = '';

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xbfd1e5);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 10, 20000);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 1000;
        controls.maxDistance = 10000;
        controls.maxPolarAngle = Math.PI / 2;

        const data = generateHeight(worldWidth, worldDepth);

        controls.target.y = data[worldHalfWidth + worldHalfDepth * worldWidth] + 500;
        camera.position.y = controls.target.y + 2000;
        camera.position.x = 2000;
        controls.update();

        const geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
        geometry.rotateX(-Math.PI / 2);

        const vertices = geometry.attributes.position.array;

        for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
            vertices[j + 1] = data[i] * 10;
        }

        geometry.computeFaceNormals();

        texture = new THREE.CanvasTexture(generateTexture((data, worldWidth, worldDepth)));
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;

        mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture}));
        scene.add(mesh);

        const geometryHelper = new THREE.ConeGeometry(20, 100, 3);
        geometryHelper.translate(0, 50, 0);
        geometryHelper.rotateX(Math.PI / 2);
        helper = new THREE.Mesh(geometryHelper, new THREE.MeshNormalMaterial());
        scene.add(helper);

        container.addEventListener('pointermove', onPointerMove);

        stats = new Stats();
        container.appendChild(stats.dom);

        window.addEventListener('resize', onWindowResize);
    }


    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }


    function render() {
        renderer.render(scene, camera);
    }

    function onPointerMove(event) {
        pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObject(mesh);

        if (intersects.length > 0) {
            helper.position.set(0, 0, 0);
            helper.lookAt(intersects[0].face.normal);
            helper.position.copy(intersects[0].point);
        }
    }
}