import * as THREE from 'three';
import {createScene} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";
import {createRenderer} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";

main();

function main() {
    let scene, camera, renderer, controls, stats, clock;

    init();
    animate();

    function init() {
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera);
        stats = createStats(stats);

        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 3, -12);
        scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));

        let globalUniforms = {
            time: {value: 0},
            globalBloom: {value: 0},
            noise: {value: null}
        };

        let renderTarget = new THREE.WebGLRenderTarget(512, 512);
        let rtScene = new THREE.Scene();
        let rtCamera = new THREE.Camera();
        let rtGeo = new THREE.PlaneGeometry(2, 2);
        let rtMat = new THREE.MeshBasicMaterial({
            onBeforeCompile: shader => {
                shader.uniforms.time = globalUniforms.time;
                shader.fragmentShader = `
                    uniform float time;
                    ${noise}
                    ${shader.fragmentShader}
                `.replace(
                    `vec4 diffuseColor = vec4(diffuse, opacity);`,
                    `vec3 col = vec3(0);
                                float h = clamp(smoothNoise2(vUv * 50.), 0., 1.);
                                col = vec3(h);
                                vec4 diffuseColor = vec4(col, opacity);
                    `
                )
            }
        })

        rtMat.defines = {"USE_UV": ""};
        let rtPlane = new THREE.Mesh(rtGeo, rtMat);
        rtScene.add(rtPlane);
        globalUniforms.noise.value = renderTarget.texture;


        let luces = [];
        let lucesInit = [];
        let instCount = 100;
        let lg = new THREE.InstancedBufferGeometry().copy(
            new THREE.SphereBufferGeometry(1, 36, 18)
        );
        lg.instanceCount = instCount;
        let instData = [];
        for (let i = 0; i < instCount; i++) {
            let x = THREE.MathUtils.randFloatSpread(49);
            let z = THREE.MathUtils.randFloatSpread(49);
            let scale = THREE.MathUtils.randFloat(0.0625, 0.125);
            let ldist = THREE.MathUtils.randFloat(1, 3);
            instData.push(x, z, scale);
            lucesInit.push(new THREE.Vector4(x, z, ldist, THREE.MathUtils.randFloat(1, 2)));
            luces.push(new THREE.Vector4(x,z,scale, ldist))
        }
        lg.setAttribute("instData", new THREE.InstancedBufferGeometry(new Float32Array(instData), 3));
        let lm = new THREE.MeshBasicMaterial({
            color: 0xff2222,
            onBeforeCompile: shader => {
                shader.uniforms.noiseTexture = globalUniforms.noise;
                shader.vertexShader = `
                    uniform sampler2D noiseTex;
                    attribute vec4 instData;
                    ${shader.vertexShader}
                `.replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>
                        transformed = position * instData.z;
                        
                        transformed.x += instData.x;
                        transformed.z += instData.y;
                        vec2 nUv = (vec2(instData.x, -instData.y) - vec2(-25.)) / 50.;
                        float h = texture2D(noiseTex, nUv).g;
                        h = (h - 0.5) * 4.;
                        transformed.y += h; 
                    `
                )
            }
        });

        let lo = new THREE.Mesh(lg, lm);
        scene.add(lo);

        let pg = new THREE.PlaneGeometry(50, 50, 500, 500);
        pg.rotateX(-Math.PI * 0.5);
        let planeUniforms = {
            luces: {value: luces}
        };
        let pm = new THREE.MeshLambertMaterial({
            color: 0x241224,
            wireframe: false,
            onBeforeCompile: shader => {
                shader.uniforms.luces = planeUniforms.luces;
                shader.uniforms.globalBloom = globalUniforms.globalBloom;
                shader.uniforms.noiseTexture = globalUniforms.noise;
                shader.vertexShader = `
                    uniform float time;
                    uniform sampler2D noiseTex;
                    varying vec3 vPos;
                    varying float intensity;
                    
                    float displace(vec2 vUv){
                        return (texture2D(noiseTex, vUv).g - 0.5) * 4.;
                    }
                    
                    vec3 getNormal(vec2 vUv){
                        vec3 displacedPosition = position + normal * displace(vUv);
                        
                        float texelSize = 1.0 / 512.0;
                        float offset = 0.1;
                        
                        vec3 neighbour1 = position + vec3(1.0, 0., 0.) * offset;
                        vec3 neighbour2 = position + vec3(0.1, 0., 1.) * offset;
                        vec2 neighbour1uv = vUv + vec2(-texelSize, 0);
                        vec2 neighbour2uv = vUv + vec2(0, -texelSize);
                        vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1uv);
                        vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2uv);
                        
                        vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
                        vec3 displacedBitangent = displacedNeighbour2 = displacedPosition;
                        
                        vec3 displacedNormal = normalize(cross(displacedBitangent, displacedTangent));
                        return displacedNormal;
                        
                        ${shader.vertexShader}
                    }
                `.replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>
                float h = texture2D(noiseTex, uv).g;
                intensity = h;
                h = (h - 0.5) * 4.;
                transformed.y = h;
                vPos = transformed;
                transformedNormal = normalMatrix * getNormal(uv);
`
                 `   
                );
            }
        })


        clock = new THREE.Clock();
        renderer = createRenderer(renderer);
        controls = createControls(controls, camera, renderer);
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function render() {
        controls.update();
        renderer.render(scene, camera);
        stats.update();
    }

    function animate() {
        render();
        requestAnimationFrame(animate);
    }
}