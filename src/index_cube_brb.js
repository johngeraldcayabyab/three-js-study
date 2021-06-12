import * as THREE from 'three/src/Three';
import {GUI} from "dat.gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from 'stats.js';
import {createContainer, createRenderer, onWindowResize} from "./helpers";

main();

function main() {

    let container, camera, scene, renderer, stats;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(1, 1);
    const gui = new GUI();



    const x = 1;

    init();
    animate();



    function init() {

        container = createContainer(container);
        renderer = createRenderer(renderer, container);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.y = 200;
        camera.position.z = 200
        camera.lookAt(0, 0, 0);

        scene = new THREE.Scene();

        const ambientLight = new THREE.AmbientLight(0x4040440);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(25, 50, 25);
        pointLight.castShadow = true;
        // pointLight.shadow.mapSize.width = 1024;
        // pointLight.shadow.mapSize.height = 1024;
        scene.add(pointLight);

        // const spotLight = new THREE.SpotLight( 0xffffff );
        // spotLight.position.set( 10, 10, 10 );
        // scene.add( spotLight );

        // const pointLight = new THREE.PointLight(0x4040440);
        // scene.add(pointLight);

        const width = 50;
        const height = 50;
        const depth = 50;

        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshPhongMaterial({color: 0xCC8866, emissive: 0xCC8866});

        // material.color = '0x00ff00';
        const cube = new THREE.Mesh(geometry, material);
        cube.castShadow = true;
        cube.receiveShadow = true;
        // cube.position.x = x;

        scene.add(cube);

        // console.log(cube);

        // cube.geometry.parameters.width = 300;
        console.log(width);
        // gui.add(cube.geometry.parameters, 'width', width, 5000);
        gui.add(cube.rotation, 'x', 0, 60).name('X Rotation');
        gui.add(cube.rotation, 'y', 0, 60).name('Y Rotation');
        gui.add(cube.rotation, 'z', 0, 60).name('Z Rotation');

        gui.add(cube.position, 'x', 0, 60).name('X Position');
        gui.add(cube.position, 'y', 0, 60).name('Y Position');
        gui.add(cube.position, 'z', 0, 60).name('Z Position');

        gui.add(cube.scale, 'x', 1, 100).name('Width');
        gui.add(cube.scale, 'y', 1, 100).name('Height');
        gui.add(cube.scale, 'z', 1, 100).name('Depth');

        new OrbitControls(camera, renderer.domElement);

        stats = new Stats();
        document.body.appendChild(stats.dom);

        window.addEventListener('resize', onWindowResize(renderer, camera));
        document.addEventListener('mousemove', onMouseMove);
    }

    // function updateCubeProperties(cube){
    //     cube.
    // }

    function onMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        raycaster.setFromCamera(mouse, camera);
        // const intersection = raycaster.intersectObject(mesh);
        // if (intersection.length > 0) {
        //     const instanceId = intersection[0].instanceId;
        //     mesh.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));
        //     mesh.instanceColor.needsUpdate = true;
        // }
        renderer.render(scene, camera);
        stats.update();
    }
}


