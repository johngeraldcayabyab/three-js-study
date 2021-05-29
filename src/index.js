import * as THREE from 'three';
import Stats from 'stats.js';
import {SimplexNoise} from "./SimplexNoise";
import {GUI} from "dat.gui";
import {GPUComputationRenderer} from "three/examples/jsm/misc/GPUComputationRenderer";
import {desktopFOV} from "./FIeldOfViews";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ImprovedNoise} from "three/examples/jsm/math/ImprovedNoise";
//

//
// const waterMaxHeight = 10;
//
// function noise(x, y) {
//     let multR = waterMaxHeight;
//     let mult = 0.025;
//     let r = 0;
//     for (let i = 0; i < 15; i++) {
//         r += multR * simplex.noise(x * mult, y * mult);
//         multR *= 0.53 + 0.025 * i;
//         mult *= 1.25;
//     }
//     return r;
// }
//
// console.log(noise.noise(20, 30));
//

const noiseScale = .025;
const noise = new SimplexNoise();
// const noise = new ImprovedNoise();


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
// ctx.fillStyle = 'green';
// ctx.fillRect(100, 100, 800, 800);

// ctx.fillStyle = 'red';
// ctx.fillRect(0, 0, 5, 5);
//
// ctx.fillStyle = 'blue';
// ctx.fillRect(5, 0, 5, 5);
//
// ctx.fillStyle = 'red';
// ctx.fillRect(10, 0, 5, 5);

for (let y = 0; y < 750; y++) {

    // for(let )
    for (let x = 0; x < 1000; x++) {

        // console.log(x, y);

        // const rgb = 255.0 * simplex.noise(x * noiseScale, y * noiseScale);
        // ctx.fillStyle = `rgba(${rgb}, ${rgb}, ${rgb}, 1)`;
        // ctx.fillStyle = 'red';
        const rgb = noise.noise(x * noiseScale, y * noiseScale);
        ctx.fillStyle = `rgba(0, 0, 0, ${rgb})`;
        ctx.fillRect(x, y, 1, 1);

        // if(x % 2){
        // ctx.fillStyle = 'red';
        // ctx.fillRect(x, y, 1, 1);
        // }
        //
        // if(y % 2){
        //     ctx.fillStyle = 'blue';
        //     ctx.fillRect(x, y, 1, 1);
        // }

    }


}

//
// let canvas = document.getElementById('canvas');
// let ctx = canvas.getContext('2d');
// let canvasWidth = canvas.width;
// let canvasHeight = canvas.height;
// ctx.clearRect(0, 0, canvasWidth, canvasHeight);
// let id = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
// let pixels = id.data;
//
// let x = Math.floor(Math.random() * canvasWidth);
// let y = Math.floor(Math.random() * canvasHeight);
// let r = Math.floor(Math.random() * 256);
// let g = Math.floor(Math.random() * 256);
// let b = Math.floor(Math.random() * 256);
// let off = (y * id.width + x) * 4;
// pixels[off] = r;
// pixels[off + 1] = g;
// pixels[off + 2] = b;
// pixels[off + 3] = 255;
//
// ctx.putImageData(id, 0, 0);