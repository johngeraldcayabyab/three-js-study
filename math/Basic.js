class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getLength() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    addVector(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtractVector(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    doubled(s) {
        return new Vector(this.x * s, this.y * s);
    }

    halfed(s) {
        return new Vector(this.x / s, this.y / s);
    }
}

class Main {
    init() {

        let pacman = new Point(3,4);
        console.log('pacmans initial speed is: ', (new Vector(pacman.x, pacman.y)).getLength());

        let pacmanDoubled = pacman.doubled(2);

        console.log('pacmans speed doubled is: ', (new Vector(pacmanDoubled.x, pacmanDoubled.y)).getLength());

        let pacmanHalfed = pacman.halfed(2);

        console.log('pacmans speed halfed is: ', (new Vector(pacmanHalfed.x, pacmanHalfed.y)).getLength());

        // let pacman = new Point(0, -1);
        // let inky = new Point(1, 1);
        // let clyde = new Point(2, -1);
        //
        // let inkyToPacman = pacman.subtractVector(inky);
        // let clydeToPacman = pacman.subtractVector(clyde);
        //
        // console.log(inkyToPacman.getLength(), clydeToPacman.getLength());
    }
}

(new Main()).init();

