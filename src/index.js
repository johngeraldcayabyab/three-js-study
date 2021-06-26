import {
    createContainer, createControls,
    createPerspectiveCamera,
    createRenderer,
    createScene,
    createStats,
} from "./helpers";

import * as THREE from 'three';
import {ImprovedNoise} from "three/examples/jsm/math/ImprovedNoise";

main();

function main() {
    let container, renderer, scene, camera, controls, stats;

    init();
    animate();

    function init() {
        container = createContainer(container);
        renderer = createRenderer(renderer, container);
        stats = createStats(stats, container);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera);
        controls = createControls(controls, camera, renderer);

        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 32;

        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, 0, 32);
        gradient.addColorStop(0.0, '#014a84');
        gradient.addColorStop(0.0, '#0561a0');
        gradient.addColorStop(0.0, '#437ab6');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 32);

        const sky = new THREE.Mesh(
            new THREE.SphereGeometry(10),
            new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(canvas), side: THREE.BackSide})
        );
        scene.add(sky);

        const size = 128
        const data = new Uint8Array(size * size * size);

        let i = 0;
        const scale = 0.05;
        const perlin = new ImprovedNoise();
        const vector = new THREE.Vector3();

        for (let z = 0; z < size; z++) {
            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const d = 1.0 - vector.set(x, y, z).subScalar(size / 2).divideScalar(size).length();
                    data[i] = (128 + 128 * perlin.noise(x * scale / 1.5, y * scale, z * scale / 1.5)) * d * d;
                    i++;
                }
            }
        }

        const texture = new THREE.DataTexture3D(data, size, size, size);
        texture.format = THREE.RedFormat;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.unpackAlignment = 1;

        const vertexShader = `
            in vec3 position;
            
            uniform mat4 modelMatrix;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform vec3 cameraPos;
            
            out vec3 vOrigin;
            out vec3 vDirection;
            
            void main(){
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                
                vOrigin = vec3(inverse(modelMatrix) * vec4(cameraPos, 1.0)).xyz;
                vDirection = position - vOrigin
                
                gl_Position = projectionMatrix * mvPosition;
            }
        `;


        window.addEventListener('resize', onWindowResize);
    }

    function animate() {
        render();
        requestAnimationFrame(animate);
    }

    function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }


    function render() {
        stats.update();
        renderer.render(scene, camera);
    }

}