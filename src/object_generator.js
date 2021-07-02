import * as THREE from '../node_modules/three/build/three.module.js';
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils";
import {jitter} from "./helpers";

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
        new THREE.MeshLambertMaterial({color: 0x000ff00})
    );
    level1.position.y = 5;
    group.add(level1);

    const level2 = new THREE.Mesh(
        new THREE.ConeGeometry(2, 2, 8),
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    );
    level2.position.y = 4;
    group.add(level2);

    const level3 = new THREE.Mesh(
        new THREE.ConeGeometry(3, 2, 8),
        new THREE.MeshLambertMaterial({color: 0x00ff00})
    );
    level3.position.y = 3;
    group.add(level3);

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 2),
        new THREE.MeshLambertMaterial({color: 0xbb6600})
    );
    trunk.position.y = 1;
    group.add(trunk);

    return group;
};

export const createCloud = () => {


    // const buffer = new THREE.BufferGeometry();

    const test1 = new THREE.SphereBufferGeometry(1.5,7,8);
    test1.translate(-2, 10, 0);

    const test2 = new THREE.SphereBufferGeometry(1.5, 7, 8);
    test2.translate(2, 10, 0);

    const test3 = new THREE.SphereBufferGeometry(2.0, 7, 8);
    test3.translate(0, 10, 0);



    const geo = BufferGeometryUtils.mergeBufferGeometries([test1, test2, test3]);
    // geo.toNonIndexed();
    // geo.computeVertexNormals();



    const cloudMesh = new THREE.Mesh(
        geo,
        new THREE.MeshPhongMaterial({color: 0xffffff, flatShading: true})
    );

    jitter(geo, 0.2);

    return cloudMesh;

    // console.log(BufferGeometryUtils.mergeBufferGeometries([test1, test2, test3]));
    // buffer.mergeBufferGeometries([test]);

    // const group = new THREE.Group();
    //
    // const tuft1 = new THREE.Mesh(
    //     new THREE.SphereBufferGeometry(1.5, 7, 8),
    //     new THREE.MeshLambertMaterial({color: 0xffffff})
    // );
    //
    // tuft1.position.x = -2;
    // tuft1.position.y = 20;
    // group.add(tuft1);
    //
    // const tuft2 = new THREE.Mesh(
    //     new THREE.SphereBufferGeometry(1.5, 7, 8),
    //     new THREE.MeshLambertMaterial({color: 0xffffff})
    // );
    // tuft2.position.x = 2;
    // tuft2.position.y = 20;
    // group.add(tuft2);
    //
    //
    // const tuft3 = new THREE.Mesh(
    //     new THREE.SphereBufferGeometry(2.0, 7, 8),
    //     new THREE.MeshLambertMaterial({color: 0xffffff})
    // );
    // tuft3.position.x = 0;
    // tuft3.position.y = 20;
    // group.add(tuft3);
    //
    //
    // // group.position
    //
    // return group;
};