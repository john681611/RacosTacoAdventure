
class Raco {
    constructor(canvas) {
        this.canvas = canvas;
        this.length = [{x: 0, y: 0}];
        this.direction = 39;
        return this;
    }
}

/**
 * Window Load
 */
window.onload = function() {
        racoGame = new Game("stage").Run({});
};