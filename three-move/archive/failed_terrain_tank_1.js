import * as THREE from 'three';
import Stats from 'stats.js';
import {desktopFOV} from "../../src/fieldOfViews.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ImprovedNoise} from "three/examples/jsm/math/ImprovedNoise";


let container, stats;
let camera, controls, scene, renderer;
let mesh, mesh2, texture;
let terrain, tank, curve, tankPosition;

const worldWidth = 256, worldDepth = 256;
const clock = new THREE.Clock();

init();
animate();

function init() {

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xefd1b5);

    //terrain
    // camera.position.set( 100, 800, - 800 );
    // camera.lookAt( - 100, 810, - 800 );

    // tank
    camera.position.set(10, 10, -10);
    camera.lookAt(0, 0, 0);


    /**
     * Codes go here
     */
    makeLight();

    terrain = generateTerrain();
    tank = makeTank();

    /**
     * Codes end here
     */


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);



// Create a sine-like wave
    curve = new THREE.SplineCurve( [
        new THREE.Vector2( -10, 0 ),
        new THREE.Vector2( -5, 5 ),
        new THREE.Vector2( 0, 0 ),
        new THREE.Vector2( 5, -5 ),
        new THREE.Vector2( 10, 0 ),
        new THREE.Vector2( 5, 10 ),
        new THREE.Vector2( -5, 10 ),
        new THREE.Vector2( -10, -10 ),
        new THREE.Vector2( -15, -8 ),
        new THREE.Vector2( -10, 0 ),
    ] );

    tankPosition = new THREE.Vector2();

    // const points = curve.getPoints( 50 );
    // const geometry = new THREE.BufferGeometry().setFromPoints( points );
    // const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    // const splineObject = new THREE.Line( geometry, material );
    // splineObject.rotation.x = Math.PI * .5;
    // splineObject.position.y = 0.05;
    // scene.add(splineObject);

    //

    window.addEventListener('resize', onWindowResize);

}



function makeLight() {
    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 20, 0);
        scene.add(light);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;

        const d = 50;
        light.shadow.camera.left = -d;
        light.shadow.camera.right = d;
        light.shadow.camera.top = d;
        light.shadow.camera.bottom = -d;
        light.shadow.camera.near = 1;
        light.shadow.camera.far = 50;
        light.shadow.bias = 0.001;
    }

    {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 2, 4);
        scene.add(light);
    }
}


function generateTerrain() {
    const data = generateHeight(worldWidth, worldDepth);
    const geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
    geometry.rotateX(-Math.PI / 2);
    const vertices = geometry.attributes.position.array;
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
        vertices[j + 1] = data[i] * 10;
    }
    texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map: texture}));
    mesh.castShadow = true;
    scene.add(mesh);

    mesh2 = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color: 0xff0000, wireframe: true}));
    mesh.castShadow = true;
    scene.add(mesh2);

    return mesh;
}

function makeTank() {
    const tankWidth = 4;
    const tankHeight = 1;
    const tankLength = 8;

    const tank = new THREE.Object3D();
    scene.add(tank);

    const bodyGeometry = new THREE.BoxGeometry(tankWidth, tankHeight, tankLength);
    const bodyMaterial = new THREE.MeshPhongMaterial({color: 0x6688AA});
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 1.4;
    bodyMesh.castShadow = true;
    tank.add(bodyMesh);


    const wheelRadius = 1;
    const wheelThickness = .5;
    const wheelSegments = 6;
    const wheelGeometry = new THREE.CylinderGeometry(
        wheelRadius,     // top radius
        wheelRadius,     // bottom radius
        wheelThickness,  // height of cylinder
        wheelSegments);
    const wheelMaterial = new THREE.MeshPhongMaterial({color: 0x888888});
    const wheelPositions = [
        [-tankWidth / 2 - wheelThickness / 2, -tankHeight / 2, tankLength / 3],
        [tankWidth / 2 + wheelThickness / 2, -tankHeight / 2, tankLength / 3],
        [-tankWidth / 2 - wheelThickness / 2, -tankHeight / 2, 0],
        [tankWidth / 2 + wheelThickness / 2, -tankHeight / 2, 0],
        [-tankWidth / 2 - wheelThickness / 2, -tankHeight / 2, -tankLength / 3],
        [tankWidth / 2 + wheelThickness / 2, -tankHeight / 2, -tankLength / 3],
    ];
    const wheelMeshes = wheelPositions.map((position) => {
        const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
        mesh.position.set(...position);
        mesh.rotation.z = Math.PI * .5;
        mesh.castShadow = true;
        bodyMesh.add(mesh);
        return mesh;
    });

    const domeRadius = 2;
    const domeWidthSubdivisions = 12;
    const domeHeightSubdivisions = 12;
    const domePhiStart = 0;
    const domePhiEnd = Math.PI * 2;
    const domeThetaStart = 0;
    const domeThetaEnd = Math.PI * .5;
    const domeGeometry = new THREE.SphereGeometry(
        domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
        domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd);
    const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);
    domeMesh.castShadow = true;
    bodyMesh.add(domeMesh);
    domeMesh.position.y = .5;

    const turretWidth = .1;
    const turretHeight = .1;
    const turretLength = tankLength * .75 * .2;
    const turretGeometry = new THREE.BoxGeometry(
        turretWidth, turretHeight, turretLength);
    const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);
    const turretPivot = new THREE.Object3D();
    turretMesh.castShadow = true;
    turretPivot.scale.set(5, 5, 5);
    turretPivot.position.y = .5;
    turretMesh.position.z = turretLength * .5;
    turretPivot.add(turretMesh);
    bodyMesh.add(turretPivot);


    return tank;

    // const turretCamera = makeCamera();
    // turretCamera.position.y = .75 * .2;
    // turretMesh.add(turretCamera);




    // const points = curve.getPoints( 50 );
    // const geometry = new THREE.BufferGeometry().setFromPoints( points );
    // const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );
    // const splineObject = new THREE.Line( geometry, material );
    // splineObject.rotation.x = Math.PI * .5;
    // splineObject.position.y = 0.05;
    // scene.add(splineObject);

    // const tankPosition = new THREE.Vector2();
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);


}

function generateHeight(width, height) {

    let seed = Math.PI / 4;
    window.Math.random = function () {

        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);

    };

    const size = width * height, data = new Uint8Array(size);
    const perlin = new ImprovedNoise(), z = Math.random() * 100;

    let quality = 1;

    for (let j = 0; j < 4; j++) {

        for (let i = 0; i < size; i++) {

            const x = i % width, y = ~~(i / width);
            data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);

        }

        quality *= 5;

    }

    return data;

}

function generateTexture(data, width, height) {

    let context, image, imageData, shade;

    const vector3 = new THREE.Vector3(0, 0, 0);

    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {

        vector3.x = data[j - 2] - data[j + 2];
        vector3.y = 2;
        vector3.z = data[j - width * 2] - data[j + width * 2];
        vector3.normalize();

        shade = vector3.dot(sun);

        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
        imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);

    }

    context.putImageData(image, 0, 0);

    // Scaled 4x

    const canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i += 4) {

        const v = ~~(Math.random() * 5);

        imageData[i] += v;
        imageData[i + 1] += v;
        imageData[i + 2] += v;

    }

    context.putImageData(image, 0, 0);

    return canvasScaled;

}

//

function animate(time) {

    // move tank
    const tankTime = time * .05;
    tank.setPosition(tankTime, 0, tankTime);
    // curve.getPointAt(tankTime % 1, tankPosition);
    // curve.getPointAt((tankTime + 0.01) % 1, tankTarget);
    // tank.position.set(tankPosition.x, 0, tankPosition.y);
    // tank.lookAt(tankTarget.x, 0, tankTarget.y);

    requestAnimationFrame(animate);

    render();
    stats.update();


}


function render() {

    controls.update(clock.getDelta());
    renderer.render(scene, camera);

}
