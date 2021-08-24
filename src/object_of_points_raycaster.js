// import "../style.css";
import * as THREE from "three";
import {createStats} from "../utils/scaffold.js";
import {createContainer} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";
import {createScene} from "../utils/scaffold.js";
import {createRenderer} from "../utils/scaffold.js";


main();

function main() {
    let pickingBackground = {
        on: new THREE.Color(0xffffff),
        off: new THREE.Color(0x403030)
    }
    let container, renderer, scene, camera, controls, stats, clock;
    let geometry;
    let counter = 5000;
    let pickingTexture;
    let pickingUniforms = {
        picking: {value: 0},
        pickingIdx: {value: counter + 1},
        time: {value: 0}
    };

    const pointer = new THREE.Vector2();

    init();
    animate();

    function init() {
        // container = createContainer(container);
        // renderer = createRenderer(renderer);
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 5, y: 5, z: 20});

        // stats = createStats(stats);



        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        renderer.domElement.addEventListener('pointermove', onPointerMove);
        controls = createControls(controls, camera, renderer);
        // container.addEventListener('pointermove', onPointerMove);






        pickingTexture = new THREE.WebGLRenderTarget(1, 1);

        const pointsMaterial = new THREE.PointsMaterial({
            size: 50,
            vertexColors: true,
            onBeforeCompile: shader => {
                shader.uniforms.time = pickingUniforms.time;
                shader.uniforms.picking = pickingUniforms.picking;
                shader.uniforms.pickingIdx = pickingUniforms.pickingIdx;
                shader.vertexShader = `
      	uniform float time;
      	uniform float pickingIdx;
      	attribute vec3 clrPick;
        attribute float idx;
        varying vec3 vClrPick;
        varying float vHighlight;
        ${shader.vertexShader}
      `.replace(
                    `#include <begin_vertex>`,
                    `#include <begin_vertex>
        	transformed.x = -1500. + mod(-1500. + (position.x + time * 50.), 3000.); // eternal cycle
        `
                )
                    .replace(
                        `#include <fog_vertex>`,
                        `#include <fog_vertex>
        	vClrPick = clrPick;
          vHighlight = pickingIdx == idx ? 1. : 0.;
        `
                    );
                shader.fragmentShader = `
      	uniform float time;
      	uniform float picking;
      	varying vec3 vClrPick;
        varying float vHighlight;
        ${shader.fragmentShader}
      `.replace(
                    `#include <color_fragment>`,
                    `#include <color_fragment>
        	float dist = distance(gl_PointCoord, vec2(0.5));
        	if ( (dist > 0.5) && (vHighlight < 0.5)) discard; // make'em round, if not highlighted
          
        	diffuseColor.rgb = (picking > 0.5) ? vClrPick : diffuseColor.rgb; // what state we render
          
          // showing off for highlighing:D
          float d = sin((dist - time * 0.25) * PI * 2. * 5.) * 0.5 + 0.5;
          vec3 col = mix(vec3(1), diffuseColor.rgb * 0.375, d);
          
          diffuseColor.rgb = (vHighlight > 0.5) ? col : diffuseColor.rgb; // highlight
        `
                );
            }
        });

        geometry = new THREE.BufferGeometry();
        let pos = [];
        let col = [];
        let c = new THREE.Color();
        let colPick = [];
        let idx = [];

        for (let i = 0; i < counter; i++) {

            let p = new THREE.Vector3().random().subScalar(0.5).multiplyScalar(3000);
            pos.push(p.clone());

            c.set(Math.random() * 0x646464 + 0x7f7f7f);
            col.push(c.r, c.g, c.b);

            c.setHex(i);
            colPick.push(c.r, c.g, c.b);

            idx.push(i);

        }

        geometry.setFromPoints(pos);
        geometry.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
        geometry.setAttribute("clrPick", new THREE.Float32BufferAttribute(colPick, 3));
        geometry.setAttribute("idx", new THREE.Float32BufferAttribute(idx, 1));

        let points = new THREE.Points(geometry, pointsMaterial);
        scene.add(points);


        clock = new THREE.Clock();

    }

//

    function onPointerMove(e) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
    }

    function animate() {
        pickingUniforms.time.value = clock.getElapsedTime();
        render();
        // stats.update();
        requestAnimationFrame(animate);
    }

    function pick() {

        //render the picking scene off-screen

        // set the view offset to represent just a single pixel under the mouse

        camera.setViewOffset(renderer.domElement.width, renderer.domElement.height, pointer.x * window.devicePixelRatio | 0, pointer.y * window.devicePixelRatio | 0, 1, 1);

        pickingUniforms.picking.value = 1;
        scene.background = pickingBackground.on;

        renderer.setRenderTarget(pickingTexture);
        renderer.render(scene, camera);

        camera.clearViewOffset();

        const pixelBuffer = new Uint8Array(4);

        renderer.readRenderTargetPixels(pickingTexture, 0, 0, 1, 1, pixelBuffer);

        const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
        if (id < counter) {
            pickingUniforms.pickingIdx.value = id;
        }

        pickingUniforms.picking.value = 0;
        scene.background = pickingBackground.off;

    }

    function render() {

        controls.update();

        pick();

        renderer.setRenderTarget(null);
        renderer.render(scene, camera);


    }
}




