import * as THREE from 'three';
import {ImprovedNoise} from "three/examples/jsm/math/ImprovedNoise";
import {
    createContainer,
    createControls,
    createPerspectiveCamera,
    createRenderer,
    createScene,
    createStats
} from "./helpers";

main();

function main() {
    let container, renderer, scene, camera, controls, stats;
    let blob;

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 10, y: 7, z: 100});
        controls = createControls(controls, camera, renderer);
        stats = createStats(stats, container);

        let blobGeometry = new THREE.IcosahedronGeometry(50, 10);
        blobGeometry.setAttribute('basePosition', new THREE.BufferAttribute().copy(blobGeometry.attributes.position));

        let blobMaterial = new THREE.MeshPhongMaterial({
            emissive: 0x00ff00,
            emissiveIntensity: 0.5,
            shininess: 0,
            wireframe: true
        });

        blob = new THREE.Mesh(blobGeometry, blobMaterial);
        scene.add(blob);

        container.addEventListener('resize', onWindowResize);
    }

    function setPoints(a = .001) {
        const basePositionAttribute = blob.geometry.getAttribute("basePosition");
        const positionAttribute = blob.geometry.getAttribute( 'position' );
        const vertex = new THREE.Vector3();

        for (let vertexIndex = 0; vertexIndex < positionAttribute.count; vertexIndex++) {
            vertex.fromBufferAttribute(basePositionAttribute, vertexIndex);

            let improvedNoise = new ImprovedNoise();

            let perlin = improvedNoise.noise(
                vertex.x * 0.006 + a * 0.0002,
                vertex.y * 0.006 + a * 0.0003,
                vertex.z * 0.006
            );

            let ratio = perlin * 0.9 + 0.8;
            vertex.multiplyScalar(ratio);


            positionAttribute.setXYZ(vertexIndex, vertex.x, vertex.y, vertex.z);
        }

        blob.geometry.attributes.position.needsUpdate = true;
        blob.geometry.computeBoundingSphere();
    }

    function render(time) {
        setPoints(time);
        controls.update();
        renderer.render(scene, camera);
    }

    function animate(time) {
        render(time);
        stats.update();
        requestAnimationFrame(animate);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}