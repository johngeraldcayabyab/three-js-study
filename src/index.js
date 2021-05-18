import * as THREE from 'three';
import Stats from 'stats.js';
import {GUI} from 'dat.gui';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
let camera, scene, renderer, model, face;

const api = {state: 'walking'};

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerHeight / window.innerHeight, 0.25, 100);
    camera.position.set(-5, 3, 10);
    camera.lookAt(new THREE.Vector3(0, 2, 0));

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0e0e);
    scene.fog = new THREE.Fog(0x0e0e0e, 20, 100);

    clock = new THREE.Clock();

    const hemLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemLight.position.set(0, 20, 0);
    scene.add(hemLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 20, 10);

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false
    }));
    mesh.rotation.x = Math.PI / 2;
    scene.add(mesh);

    const grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    const loader = new GLTFLoader();
    loader.load('../textures/RobotExpressive.glb', function (gltf) {
        model = gltf.scene;
        scene.add(model);

        createGUI(model, gltf.animations);
    }, undefined, function (e) {
        console.log(e);
    });

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize);

    stats = new Stats();
    container.appendChild(stats.dom);
}

function createGUI(model, animations) {
    const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
    const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

    gui = new GUI;

    mixer = new THREE.AnimationMixer(model);
    actions = {};

    for (let i = 0; i < animations.length; i++) {
        const clip = animations[i];
        const action = mixer.clipAction(clip);
        actions[clip.name] = action;

        if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
        }
    }

    const statesFolder = gui.addFolder('States');
    const clipCtrl = statesFolder.add(api, 'state').options(states);

    clipCtrl.onChange(function () {
        fadeToAction(api.state, 0.5);
    });

    statesFolder.open();

    const emoteFolder = gui.addFolder('Emotes');

    function createEmoteCallback(name) {
        api[name] = function () {
            fadeToAction(name, 0.2);
            mixer.addEventListener('finished', restoreState);
        }
    }

    function restoreState() {
        mixer.addEventListener('finished', restoreState);
        fadeToAction(api.state, 0.2);
    }

    for (let i = 0; i < emotes.length; i++) {
        createEmoteCallback(emotes[i]);
    }

    emoteFolder.open();

    face = model.getObjectByName('Head_4');

    const expressions = Object.keys(face.morphTargetDictionary);
    const expressionsFolder = gui.addFolder('Expressions');

    for (let i = 0; i < expressions.length; i++) {
        expressionsFolder.add(face.morphTargetDictionary, i, 0, 1, 0.01).name(expressions[i]);
    }

    activeAction = actions['Walking'];
    activeAction.play();

    expressionsFolder.open();
}

function fadeToAction(name, duration) {
    previousAction = activeAction;
    activeAction = actions[name];

    if (previousAction !== activeAction) {
        previousAction.fadeOut(duration);
    }

    activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
    const dt = clock.getDelta();
    if (mixer) mixer.update(dt);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
}