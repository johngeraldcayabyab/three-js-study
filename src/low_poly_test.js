import "../style.css";
import * as THREE from 'three';
import {createContainer} from "../utils/scaffold.js";
import {createRenderer} from "../utils/scaffold.js";
import {createScene} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";
import {createPlane} from "../utils/object_generator.js";
import {createPineTree} from "../utils/object_generator.js";
import {createCloud} from "../utils/object_generator.js";

main();

function main() {
    let container, renderer, scene, camera, controls, stats;

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 10, y: 7, z: 10});
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats, container);

        const plane = createPlane();
        scene.add(plane);

        const pineTree = createPineTree();
        scene.add(pineTree);

        const cloud = createCloud();
        scene.add(cloud);

        const light2 = new THREE.DirectionalLight( 0xff5566, 0.7 );
        light2.position.set( -3, -1, 0 ).normalize();
        scene.add( light2 );

        const light3 = new THREE.DirectionalLight( 0xffffff, 0.7 );
        light3.position.set( 1, 1, 0 ).normalize();
        scene.add( light3 );
        scene.add(new THREE.AmbientLight(0xffffff,0.3))

        container.addEventListener('resize', onWindowResize);
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

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}