import * as THREE from '../node_modules/three/build/three.module.js';
import {BufferGeometryUtils} from "../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
import {jitter} from "./helpers.js";

export const createPlane = () => {
    const geometry = new THREE.PlaneGeometry(500, 500, 32);
    const material = new THREE.MeshLambertMaterial({color: 0x6584b5, side: THREE.DoubleSide});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = 300;
    return mesh;
};

export const createPineTree = () => {
    const group = new THREE.Group();

    const level1 = new THREE.Mesh(
        new THREE.ConeGeometry(1.5, 2, 8),
        new THREE.MeshPhongMaterial({color: 0x000ff00})
    );
    level1.position.y = 5;
    group.add(level1);

    const level2 = new THREE.Mesh(
        new THREE.ConeGeometry(2, 2, 8),
        new THREE.MeshPhongMaterial({color: 0x00ff00})
    );
    level2.position.y = 4;
    group.add(level2);

    const level3 = new THREE.Mesh(
        new THREE.ConeGeometry(3, 2, 8),
        new THREE.MeshPhongMaterial({color: 0x00ff00})
    );
    level3.position.y = 3;
    group.add(level3);

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 2),
        new THREE.MeshPhongMaterial({color: 0xbb6600})
    );
    trunk.position.y = 1;
    group.add(trunk);

    return group;
};

export const createCloud = () => {
    const test1 = new THREE.TetrahedronBufferGeometry(1.5, 3);
    test1.translate(-2, 10, 0);

    const test2 = new THREE.TetrahedronBufferGeometry(1.5, 3);
    test2.translate(2, 10, 0);

    const test3 = new THREE.TetrahedronBufferGeometry(2.0, 3);
    test3.translate(0, 10, 0);

    const geo = BufferGeometryUtils.mergeBufferGeometries([test1, test2, test3]);

    return new THREE.Mesh(
        geo,
        new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true})
    );
};