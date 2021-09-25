class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getLength() {
        //Pythagorean theorem
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    getNormalizedVector() {
        let length = this.getLength();
        this.x = this.x / length;
        this.y = this.y / length;
        return this;
    }

    getNormalizedLength() {
        return this.getNormalizedVector().getLength();
    }

    getDotProduct() {

    }
}

class PointVector {
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

    doubled(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    halfed(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    normalized() {
        // let length =getLength();
        // return this
    }
}

class Main {
    init() {


        /**
         * code about speed
         */
        // let pacman = new Point(3,4);
        // console.log('pacmans initial speed is: ', (new Vector(pacman.x, pacman.y)).getLength());
        //
        // let pacmanDoubled = pacman.doubled(2);
        //
        // console.log('pacmans speed doubled is: ', (new Vector(pacmanDoubled.x, pacmanDoubled.y)).getLength());
        //
        // let pacmanHalfed = pacman.halfed(2);
        //
        // console.log('pacmans speed halfed is: ', (new Vector(pacmanHalfed.x, pacmanHalfed.y)).getLength());


        /**
         * Code about length vector
         */
        let pacman = new PointVector(3, 4);
        let inky = new PointVector(1, 2);
        // let clyde = new PointVector(2, -1);

        let inkyToPacmanLength = pacman.subtractVector(inky);


        console.log(inkyToPacmanLength.getNormalizedVector());
        console.log(inkyToPacmanLength.getNormalizedLength());

        // let clydeToPacman = pacman.subtractVector(clyde);

        // console.log(inkyToPacman.getLength(), clydeToPacman.getLength());
    }

}

(new Main()).init();

