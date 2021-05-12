import * as THREE from 'three';

function main() {
    let container, stats;

    let camera, scene, renderer;
    let controls;


    const clock = new THREE.Clock();

    init();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 15000);
        camera.position.z = 250;

        scene = new THREE.Scene();
        scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
        scene.fog = new THREE.Fog(scene.background, 3500, 15000);

        const s = 250;

        const geometry = new THREE.BoxGeometry(s, s, s);
        const material = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xffffff, shininess: 50});

        for (let i = 0; i < 3000; i++){
            const mesh = new THREE.Mesh(geometry, material);

            mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
            mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
            mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;

            mesh.matrixAutoUpdate = false;
            mesh.updateMatrix();

            scene.add(mesh);
        }


        const dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
        dirLight.position.set(0, -1, 0).normalize();
        dirLight.color.setHSL(0.1, 0.7, 0.5);
        scene.add(dirLight);

        const textureLoader = new THREE.TextureLoader();

        const textureFlare0 = new textureLoader.load('../textures/lensflare0.png');
        const textureFlare3 = new textureLoader.load('../textures/lensflare3.png');


    }

    function addLight(){

    }


}

main();