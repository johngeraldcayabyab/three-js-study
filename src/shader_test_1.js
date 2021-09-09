import * as THREE from "three";

const clock = new THREE.Clock();
const scene = new THREE.Scene();

// camera
let aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(15, aspect, 1, 1000);
camera.position.z = 10;

// renderer
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const uniforms = {
    u_resolution: {
        value: {
            x: null,
            y: null
        },
    },
    u_time: {
        value: 0.0,
    },
    u_mouse: {
        value: {
            x: null,
            y: null,
        }
    }
};

const vShader = `
    varying vec2 v_uv;
    
    void main(){
        v_uv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * 
        vec4(position, 1.0);
    }
`;

const fShader = `
    varying vec2 v_uv;
    uniform vec2 u_mouse;
    uniform vec2 u_resolution;
    uniform vec3 u_color;
    uniform float u_time;
    
    void main(){
        vec2 v = u_mouse / u_resolution;
        vec2 uv = gl_FragCoord.xy / u_resolution;
        gl_FragColor = vec4(1.0, 0.0, sin(u_time * 5.0) + 0.5, 1.0).rgba;
    }
`;

// geometry and material
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshNormalMaterial();
const material = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader,
    uniforms
});
// mesh
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // add to scene

// render
function render() {
    // rotate the cube
    cube.rotation.y += 0.01;
    cube.rotation.x += 0.01;
    // animation loop

    uniforms.u_time.value = clock.getElapsedTime();


    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

// EVENT LISTENERS \/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
// mousemove
document.addEventListener('mousemove', (e) => {
    window.addEventListener('resize', onWindowResize, false);
    uniforms.u_mouse.value.x = e.clientX;
    uniforms.u_mouse.value.y = e.clientY;
});

// window resize
function onWindowResize(event) {
    if (uniforms.u_resolution !== undefined) {
        uniforms.u_resolution.value.x = window.innerWidth;
        uniforms.u_resolution.value.y = window.innerHeight;
    }
    const aspectRatio = window.innerWidth / window.innerHeight;
    let width, height;
    if (aspectRatio >= 1) {
        width = 1;
        height = (window.innerHeight / window.innerWidth) * width;
    } else {
        width = aspectRatio;
        height = 1;
    }
    camera.left = -width;
    camera.right = width;
    camera.top = height;
    camera.bottom = -height;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// run everything
render();