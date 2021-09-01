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
            luces.push(new THREE.Vector4(x, z, scale, ldist))
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
          }
          
          
          ${shader.vertexShader}
        `.replace(
                    `#include <begin_vertex>`
                    , `
                    #include <begin_vertex>
                    
                    float h = texture2D(noiseTex,uv).g;
                    intensity = h;
                    h = (h - 0.5) * 4.;
                    vPos = transformed;
                    transformedNormal = normalMatrix * getNormal(uv);
                `);
                shader.fragmentShader = `
                    uniform vec4 luces[${instCount}];
                    uniform sampler2D noiseTex;
                    uniform float globalBloom;
                    varying vec3 vPos;
                    varying float intensity;
                    
                    ${shader.fragmentShader}
                `.replace(
                    `#include <fog_fragment>`,
                    `
                        vec3 col = vec3(1,0,0)*0.75;
                        float intensity = 0.;
                        for(int i = 0; i < ${instCount}; i++){
                            vec4 lux = luces[i];
                            vec2 luxUv = (vec2(lux.x, -lux.y) - vec2(-25.)) / 50.;
                            float h = texture2D(noiseTex, luxUv).g;
                            h = (h - 0.5) * 4.;
                            vec3 lightPos = vec3(lux.x, h, lux.y);
                            float currIntensity = smoothstep(lux.z + lux.w, lux.z,
                            distance(vPos, lightPos));
                            intensity += pow(currIntensity, 16.);
                        }
                        intensity = clamp(intensity, 0.1, 1.);
                        col = mix(col * 0.5, col, intensity);
                        col = mix(gl_FragColor.rgb, col, intensity);
                        col += vec3(1) * intensity * 0.01;
                        gl_FragColor = vec4(col, opacity);
                        #include <fog_fragment>
                    `
                ).replace(
                    `#include <dithering_fragment>`,
                    `#include <dithering_fragment>
                                if(globalBloom > 0.5){
                                    gl_FragColor = vec(0);
                                }
                            `
                );
            }
        });

        let plane = new THREE.Mesh(pg, pm);
        scene.add(plane);

        let tg = new THREE.PlaneGeometry();
        tg.translate(0, 0.5, 0);
        tg.scale(5, 5, 5);
        let tm = new THREE.MeshBasicMaterial({
            color: 0xff4400,
            fog: false,
            transparent: true,
            onBeforeCompile: shader => {
                shader.uniforms.time = globalUniforms.time;
                shader.uniforms.globalBloom = globalUniforms.globalBloom;
                shader.fragmentShader = `
                    #define S(a,b ,t) smoothstep(a,b,t)
                    uniform float time;
                    uniform float globalBloom;
                    
                    ${noise}
                    
                    float getTri(vec2 uv, float shift){
                        uv = uv * 2.-1.;
                        float a = atan(uv.x + shift,uv.y) + 3.1415926;
                        float r = 3.1415926 * 2./3.;
                        return cos(floor(.5+a/r)*r-a)*length(uv);
                    } 
                    
                    float doubleTri(vec2 uv, float still, float width){
                        vec2 baseUv = uv;
                        vec2 e2 = fwidth(baseUv * 20.);
                        float e = min(e2.x, e2.y) * width;
                        float baseTri = getTri(baseUv, cos(baseUv.y * 31. + time) *
                        sine(baseUv.y * 27. + time * 4.( * 0.025 * still);
                        float d = abs(fract(baseTri * 20.) - 0.5);
                        float tri = S(e, 0., td) - S(0., e, td);
                        tri *= step(0.4, baseTri) - step(0.5, baseTri);
                        return tri;
                    }
                    
                    ${shader.fragmentShader}
                `.replace(
                    `vec4 diffuseColor = vec4(diffuse, opacity);`,
                    `
                        float tri = doubleTri(vUv, 0.0, 16.);
                        float triWave = doubleTri(vUv, 1.0, 8.);
                        float fullTri = max(tri, triWave);
                        
                        if(fullTri < 0.5) discard;
                        
                        vec3 col = mix(diffuse, vec3(0.75), fullTri);
                        
                        float blinking = smoothNoise(vec2(time, time * 5.));
                        blinking = blinking * 0.9 + 0.1;
                        
                        vec4 diffuseColor = vec4(col * blinking, fullTri);
                    `
                ).replace(
                    `#include <dithering_fragment>`,
                    `#include <dithering_fragment>
                    if(globalBloom > 0.5){
                    
                        gl_FragColor = vec4(gl_FragColor.rgb * 0.375, fullTri);
                    }
`
                );
            }
        });

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