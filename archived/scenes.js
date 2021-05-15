import * as THREE from 'three';

let windowInnerWidth = window.innerWidth;
let windowInnerHeight = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, windowInnerWidth / windowInnerHeight, 0.1, 800);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();

const pinkMaterial = new THREE.MeshBasicMaterial({color: 0xFFC0CB});
const pinkCube = new THREE.Mesh(geometry, pinkMaterial);
scene.add(pinkCube);

const redMaterial = new THREE.MeshBasicMaterial({color: 0xFF281F});
const redCube = new THREE.Mesh(geometry, redMaterial);
scene.add(redCube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    pinkCube.rotation.x += 0.01;
    pinkCube.rotation.y += 0.01;

    redCube.rotation.x -= 0.01;
    redCube.rotation.y -= 0.01;

    renderer.render(scene, camera);
}

animate();