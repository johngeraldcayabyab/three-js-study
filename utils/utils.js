import * as THREE from "three";

export const makeAxesGrid = (node, units = 10) => {
    const axes = new THREE.AxesHelper(10);
    axes.material.depthTest = false;
    axes.renderOrder = 2;
    node.add(axes);

    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);
};

export const getWorldPosition = (object) => {
    const vector3 = new THREE.Vector3();
    vector3.setFromMatrixPosition(object.matrixWorld);
    return vector3;
};