import * as THREE from 'three';
import {GUI} from 'dat.gui';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {makeAxisGrid} from "./helpers";

function main() {

    const scene = new THREE.Scene();
    const gui = new GUI();

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(50, 50, 15);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({antialias: true});

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor(0xfff6e6);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    const planeShadow = new THREE.ShaderMaterial();
    planeShadow.opacity = 0.2;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(50, 50, 50, 50),
        // new THREE.MeshBasicMaterial({color: 0x393839, wireframe: true})
        planeShadow
    );
    plane.receiveShadow = true;
    plane.rotateX(Math.PI / 2);
    scene.add(plane);

    const geometry = new THREE.OctahedronGeometry(10, 1);

    const material = new THREE.MeshStandardMaterial({
        color: 0xff0051,
        shading: THREE.FlatShading,
        metalness: 0,
        roughness: 1
    });

    const shapeOne = new THREE.Mesh(geometry, material);
    shapeOne.position.y += 10;
    shapeOne.castShadow = true;
    shapeOne.receiveShadow = true;
    scene.add(shapeOne);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(25, 50, 25);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    scene.add(pointLight);

    makeAxisGrid(gui, camera, 'camera');
    makeAxisGrid(gui, ambientLight, 'ambientLight');
    makeAxisGrid(gui, pointLight, 'pointLight');

    function render(time) {
        time *= 0.001;
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

}

main();

