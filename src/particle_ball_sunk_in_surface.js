import * as THREE from "three";
import {createRenderer} from "../utils/scaffold.js";
import {createScene} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";

main();

function main() {
    let renderer, scene, camera, controls, stats;

    let gpl, pt;

    init();
    animate();

    function init() {
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 5, y: 5, z: 20});
        stats = createStats(stats);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(0, 6, 6);
        scene.add(directionalLight);

        let gpt = new THREE.IcosahedronGeometry(5, 7);
        let mpt = new THREE.PointsMaterial({size: 0.15, color: 0x00ffff});
        pt = new THREE.Points(gpt, mpt);
        scene.add(pt);

        gpl = new THREE.PlaneGeometry(20, 20, 100, 100);
        gpl.rotateX(Math.PI * -0.5);

        bendThePlane(5, 3, 10);

        let mpl = new THREE.PointsMaterial({size: 0.05, color: 0xaaaaaa});
        let pl = new THREE.Points(gpl, mpl);
        scene.add(pl);

        renderer = createRenderer(renderer);
        controls = createControls(controls, camera, renderer);
        window.addEventListener('resize', onWindowResize);
    }

    function bendThePlane(radius, pHeight, smoothness) {
        let pos = gpl.attributes.position;
        let v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            let a = pHeight;
            let b = getSphereCone(v3, -3, radius);
            let sm = smoothFunc(a, b, smoothness);
            pos.setY(i, sm);
        }
    }

    function getSphereCone(p, h, r) {
        let dist = Math.hypot(p.x, p.z);
        let limR = Math.sqrt(r * r - h * h);

        let res;
        if (dist <= limR) {
            res = Math.sqrt(r * r - dist * dist) * Math.sign(h);
        } else {
            res = h - (dist - limR) * (limR / h);
        }

        return res;
    }

    function smoothFunc(a, b, k) {
        let h = Math.max(0, Math.min(1, ((b - a) / k) + 0.5));
        let m = h * (1 - h) * k;
        return (h * a) + ((1 - h) * b) - (m * 0.5);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        render();
        stats.update();
        requestAnimationFrame(animate);
    }

    function render(time) {
        time *= 0.001;
        controls.update();
        renderer.render(scene, camera);
    }
}