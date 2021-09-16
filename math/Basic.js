class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addVector(vector) {
        this.x = this.x + vector.x;
        this.y = this.y + vector.y;
        console.log({
            x: this.x,
            y: this.y,
        });
    }

    subtractVector(vector) {
        this.x = this.x - vector.x;
        this.y = this.y - vector.y;
        console.log({
            x: this.x,
            y: this.y
        })
    }

    getLength() {
        this.length = Math.sqrt((this.x * this.x) + (this.y * this.y));
        console.log({
            length: this.length
        })
    }
}

class Main {
    init() {
        let pacman = new Vector(0, -1);
        let inky = new Vector(1, 1);
        let clyde = new Vector(2, -1);
        pacman.subtractVector(inky);
        let distance = new Vector(pacman.x, pacman.y);
        distance.getLength();
    }
}

(new Main()).init();

