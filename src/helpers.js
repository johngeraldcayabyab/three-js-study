import * as THREE from "three";

class AxisGridHelper {
    constructor(node, units = 10) {
        const axes = new THREE.AxesHelper();
        axes.material.depthTest = false;
        axes.renderOrder = 2;
        node.add(axes);

        const grid = new THREE.GridHelper(units, units);
        grid.material.depthTest = false;
        grid.renderOrder = 1;
        node.add(grid);

        this.grid = grid;
        this.axes = axes;
        this.visible = false;
    }

    get visible() {
        return this._visible;
    }

    set visible(v) {
        this._visible = v;
        this.grid.visible = v;
        this.axes.visible = v;
    }
}


export const makeAxisGrid = (gui, node, label, units) => {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
};

export const generateRandomNumberBetween = (value) => {
    return Math.floor((Math.random() * value) + 1);
}