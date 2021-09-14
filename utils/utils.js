import * as THREE from "three";

export const makeAxesGrid = (node, units = 10, size = 10) => {
    const axes = new THREE.AxesHelper(size);
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


export const goToVector = (fromMesh, toMesh, log = false) => {
    let subVector = new THREE.Vector3();
    subVector = subVector.subVectors(fromMesh.position, toMesh.position);
    let distance = subVector.length();
    let direction = subVector.normalize();
    if (distance > 0.3) {
        fromMesh.position.x = fromMesh.position.x - (direction.x * .1);
        fromMesh.position.y = fromMesh.position.y - (direction.y * .1);
        fromMesh.position.z = fromMesh.position.z - (direction.z * .1);
        if (log) {
            console.log('distance of mesh1 to mesh 2', log);
        }
    }
}