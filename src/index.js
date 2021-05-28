import * as THREE from 'three';
import Stats from 'stats.js';
import {SimplexNoise} from "./SimplexNoise";
import {GUI} from "dat.gui";
import {GPUComputationRenderer} from "three/examples/jsm/misc/GPUComputationRenderer";
import {desktopFOV} from "./FIeldOfViews";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
//
// let simplex = new SimplexNoise();
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


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
// ctx.fillStyle = 'green';
// ctx.fillRect(100, 100, 800, 800);

ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 5, 5);

ctx.fillStyle = 'blue';
ctx.fillRect(5, 0, 5, 5);

ctx.fillStyle = 'red';
ctx.fillRect(10, 0, 5, 5);

for(let i = 0; i < 800; i++){

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