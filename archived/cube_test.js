import * as THREE from 'THREE';
import {GUI} from "dat.gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {DragControls} from "three/examples/jsm/controls/DragControls";

function main() {
    const scene = new THREE.Scene();
    const gui = new GUI();

    const fov = 75;
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;
    const near = 0.1;
    const far = 1000;

    const camera = new THREE.PerspectiveCamera(fov, windowInnerWidth / windowInnerHeight, near, far);


    const renderer = new THREE.WebGLRenderer({antialias: true});
    const enableSelection = false;
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    // const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setSize(windowInnerWidth, windowInnerHeight);
    document.body.appendChild(renderer.domElement);


    const geometry = new THREE.BoxGeometry(.5, .5, .5);
    const material = new THREE.MeshPhongMaterial({color: 0x00FF00});
    const cube = new THREE.Mesh(geometry, material);
    // cube.position.x = 5;

    scene.add(cube);

    // wireframe
    let geo = new THREE.EdgesGeometry(cube.geometry);
    let mat = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 4});
    let wireframe = new THREE.LineSegments(geo, mat);
    wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
    cube.add(wireframe);

    camera.position.z = 5;

    const light = new THREE.PointLight(0xffffff, 10);
    light.position.z = 5;

    // light.shadow.camera.near = near;
    // light.shadow.camera.far = far;
    // light.shadow.camera.fov = fov;
    scene.add(light);

    class AxisGridHelper {
        constructor(node, units = 10) {
            const axes = new THREE.AxesHelper();
            axes.material.depthTest = false;
            axes.renderOrder = 2;
            node.add(axes);

            const grid = new THREE.GridHelper(units, units);
            grid.material.depthTest = false;
            grid.renderOrder = 1;
            node.add(grid);

            this.grid = grid;
            this.axes = axes;
            this.visible = false;
        }

        get visible() {
            return this._visible;
        }

        set visible(v) {
            this._visible = v;
            this.grid.visible = v;
            this.axes.visible = v;
        }
    }

    function makeAxisGrid(node, label, units) {
        const helper = new AxisGridHelper(node, units);
        gui.add(helper, 'visible').name(label);
    }

    makeAxisGrid(cube, 'cube');
    makeAxisGrid(light, 'light');
    makeAxisGrid(camera, 'camera');

    const newControls = new DragControls( cube, camera, renderer.domElement );

    newControls.addEventListener('drag', renderer, animate);


    function onWindowResize(){

    }

    function onKeyDown(event){
        event.preventDefault();
        // if
    }

    function onKeyUp(){

    }

    function onClick(event){
        event.preventDefault();
        if(enableSelection === true){
            const draggableObjects = newControls.getObjects();
            draggableObjects.length = 0;

            mouse.x = (event.clientX / windowInnerWidth) * 2 -1;
            mouse.y = (event.clientY / window.innerHeight) * 2 +1;

            raycaster.setFromCamera(mouse, camera);

            const intersections = raycaster.intersectObject(cube, true);

            if(intersections.length > 0){

            }
        }
    }


    animate(time);

    function animate(time) {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        // controls.update();
        renderer.render(scene, camera);
    }
}

main();