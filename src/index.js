import * as THREE from 'three';

function main(){

    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.set(5, 5, 0);

    camera.lookAt(new THREE.Vector3(0, 0, 0));



    let renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor(0xfff6e6);

    document.body.appendChild(renderer.domElement);

    let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5, 5, 5),
        new THREE.MeshBasicMaterial({color: 0x393839, wireframe: true})
    );
    plane.rotateX(Math.PI / 2);
    scene.add(plane);

    renderer.render(scene, camera);

    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });
}

main();

