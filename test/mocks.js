export const scene = {
    scale: {
        width: 800,
        height: 600
    }
};

export class Item {
    constructor(x, y, width, height) {
        this.origin = { x: 0.5, y: 0.5 };
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    setOrigin(x, y) {
        this.origin.x = x;
        this.origin.y = y;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setScrollFactor(x, y) { }

    destroy() {
        delete this;
    }
}