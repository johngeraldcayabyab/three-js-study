import * as THREE from "three";
import {createRenderer} from "../utils/scaffold.js";
import {createScene} from "../utils/scaffold.js";
import {createPerspectiveCamera} from "../utils/scaffold.js";
import {createControls} from "../utils/scaffold.js";
import {createStats} from "../utils/scaffold.js";
import {createAirplane} from "../utils/object_generator.js";

main();

function main() {
    let renderer, scene, camera, controls, stats;
    let t;
    const n0 = new THREE.Vector3(0, 1, 0);
    const n = new THREE.Vector3();
    const b = new THREE.Vector3();
    const M3 = new THREE.Matrix3();
    const M4 = new THREE.Matrix4();
    let f = 0;
    let p = new THREE.Vector3();
    let i = 0;

    let curve;
    let airplane;

    init();
    animate();

    function init() {
        scene = createScene(scene);
        camera = createPerspectiveCamera(camera, {x: 120, y: 100, z: 400});
        stats = createStats(stats);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
        directionalLight.position.set(0, 6, 6);
        scene.add(directionalLight);

        const hlp = new THREE.GridHelper(1000, 20);
        scene.add(hlp);

        const somePoints = [
            new THREE.Vector3(-500, 0, -500),
            new THREE.Vector3(0, 0, -400),

            new THREE.Vector3(500, 100, -500),
            new THREE.Vector3(400, 100, 0),

            new THREE.Vector3(500, 0, 500),
            new THREE.Vector3(0, 100, 400),

            new THREE.Vector3(-500, 0.4, 500),
            new THREE.Vector3(-400, 100, 0),
        ];

        const pts = new THREE.Points(new THREE.BufferGeometry().setFromPoints(somePoints), new THREE.PointsMaterial({
            color: "white",
            size: 20
        }));
        scene.add(pts);

        curve = new THREE.CatmullRomCurve3(somePoints);
        curve.closed = true;

        const points = curve.getPoints(80);
        const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({color: 0xffffaa}));
        scene.add(line);

        airplane = createAirplane();

        scene.add(airplane);

        renderer = createRenderer(renderer);
        controls = createControls(controls, camera, renderer);
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {

        if (f === 0 || f > 1) {
            n.copy(n0);
            f = 0;
        }

        f += 0.0009;

        t = curve.getTangent(f);
        b.crossVectors(t, n);
        n.crossVectors(t, b.negate());

        M3.set(t.x, n.x, b.x, t.y, n.y, b.y, -t.z, n.z, b.z);

        M4.setFromMatrix3(M3);

        p = curve.getPoint(f);


        airplane.setRotationFromMatrix(M4);
        airplane.position.set(p.x, p.y, p.z);
        airplane.children[7].rotation.x += 0.3;

        render();
        stats.update();
        requestAnimationFrame(animate);
    }

    function render() {
        controls.update();
        renderer.render(scene, camera);
    }
}