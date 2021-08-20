import * as THREE from 'three';
import {BufferGeometryUtils} from "three/examples/jsm/utils/BufferGeometryUtils.js";

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

export const createAirplane = () => {
    let Colors = {
        red:0xf25346,
        yellow:0xedeb27,
        white:0xd8d0d1,
        brown:0x59332e,
        pink:0xF5986E,
        brownDark:0x23190f,
        blue:0x68c3c0,
        green:0x458248,
        purple:0x551A8B,
        lightgreen:0x629265,
    };

    const mesh = new THREE.Object3D();

    let geomCockpit1 = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    let matCockpit1 = new THREE.MeshPhongMaterial({color: Colors.red, flatShading: true});

    let cockpit1 = new THREE.Mesh(geomCockpit1, matCockpit1);
    cockpit1.castShadow = true;
    cockpit1.receiveShadow = true;
    mesh.add(cockpit1);

    let geomCockpit2 = new THREE.BoxGeometry(50, 30, 30, 1, 1, 1);
    let matCockpit2 = new THREE.MeshPhongMaterial({color: Colors.red, flatShading: true});

    let cockpit2 = new THREE.Mesh(geomCockpit2, matCockpit2);
    cockpit2.castShadow = true;
    cockpit2.receiveShadow = true;
    cockpit2.position.x = -21;
    cockpit2.position.y = 10;
    mesh.add(cockpit2);




    let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    let matEngine = new THREE.MeshPhongMaterial({color: Colors.white, flatShading: true});
    let engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    mesh.add(engine);

    let geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    let matTailPlane = new THREE.MeshPhongMaterial({color: Colors.red, flatShading: true});
    let tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-50, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    mesh.add(tailPlane);

    let geomSideWing = new THREE.BoxGeometry(40, 4, 150, 1, 1, 1);
    let matSideWing = new THREE.MeshPhongMaterial({color: Colors.red, flatShading: true});

    let sideWingTop = new THREE.Mesh(geomSideWing, matSideWing);
    let sideWingBottom = new THREE.Mesh(geomSideWing, matSideWing);
    sideWingTop.castShadow = true;
    sideWingTop.receiveShadow = true;
    sideWingBottom.castShadow = true;
    sideWingBottom.receiveShadow = true;

    sideWingTop.position.set(20, 12, 0);
    sideWingBottom.position.set(20, -3, 0);
    mesh.add(sideWingTop);
    mesh.add(sideWingBottom);

    let geomWindShield = new THREE.BoxGeometry(3, 15, 20, 1, 1, 1);
    let matWindShield = new THREE.MeshPhongMaterial({
        color: Colors.white,
        transparent: true,
        opacity: .3,
        flatShading: true
    });
    let windShield = new THREE.Mesh(geomWindShield, matWindShield);
    windShield.position.set(5, 27, 0);
    windShield.castShadow = true;
    windShield.receiveShadow = true;
    mesh.add(windShield);


    let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    let matPropeller = new THREE.MeshPhongMaterial({color: Colors.brown, flatShading: true});
    let propeller = new THREE.Mesh(geomPropeller, matPropeller);
    propeller.castShadow = true;
    propeller.receiveShadow = true;

    let geomBlade1 = new THREE.BoxGeometry(1, 100, 10, 1, 1, 1);
    let geomBlade2 = new THREE.BoxGeometry(1, 10, 100, 1, 1, 1);
    let matBlade = new THREE.MeshPhongMaterial({color: Colors.brownDark, flatShading: true});

    let blade1 = new THREE.Mesh(geomBlade1, matBlade);
    blade1.position.set(8, 0, 0);
    blade1.castShadow = true;
    blade1.receiveShadow = true;

    let blade2 = new THREE.Mesh(geomBlade2, matBlade);
    blade2.position.set(8, 0, 0);
    blade2.castShadow = true;
    blade2.receiveShadow = true;

    propeller.add(blade1, blade2);
    propeller.position.set(50, 0, 0);
    mesh.add(propeller);

    let wheelProtecGeom = new THREE.BoxGeometry(30, 15, 10, 1, 1, 1);
    let wheelProtecMat = new THREE.MeshPhongMaterial({color: Colors.white, flatShading: true});
    let wheelProtecR = new THREE.Mesh(wheelProtecGeom, wheelProtecMat);
    wheelProtecR.position.set(25, -20, 25);
    mesh.add(wheelProtecR);


    let wheelTireGeom = new THREE.BoxGeometry(24,24,4);
    let wheelTireMat = new THREE.MeshPhongMaterial({color:Colors.brownDark, flatShading:true});
    let wheelTireR = new THREE.Mesh(wheelTireGeom,wheelTireMat);
    wheelTireR.position.set(25,-28,25);

    let wheelAxisGeom = new THREE.BoxGeometry(10,10,6);
    let wheelAxisMat = new THREE.MeshPhongMaterial({color:Colors.brown, flatShading:true});
    let wheelAxis = new THREE.Mesh(wheelAxisGeom,wheelAxisMat);
    wheelTireR.add(wheelAxis);

    mesh.add(wheelTireR);

    let wheelProtecL = wheelProtecR.clone();
    wheelProtecL.position.z = -wheelProtecR.position.z ;
    mesh.add(wheelProtecL);

    let wheelTireL = wheelTireR.clone();
    wheelTireL.position.z = -wheelTireR.position.z;
    mesh.add(wheelTireL);








    let suspensionGeom = new THREE.BoxGeometry(4,20,4);
    suspensionGeom.applyMatrix4(new THREE.Matrix4().makeTranslation(0,10,0));
    let suspensionMat = new THREE.MeshPhongMaterial({color:Colors.red, flatShading:true});
    let suspension = new THREE.Mesh(suspensionGeom,suspensionMat);
    suspension.position.set(-55,-5,0);
    suspension.rotation.z = -.6;
    mesh.add(suspension);

    let wheelTireB = wheelTireR.clone();
    wheelTireB.scale.set(.5,.5,.5);
    wheelTireB.position.set(-55,-5,0);
    mesh.add(wheelTireB);



    return mesh;
};