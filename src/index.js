import * as THREE from 'three';
import {createContainer, createRenderer} from "./helpers";
import Stats from 'stats.js';
import GUI from 'dat.gui';

main();

function main() {
    let container, renderer, scene, camera, stats, gui;


    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);


        stats = new Stats();
    }

    function animate() {

    }
}