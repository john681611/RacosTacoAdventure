class Stage {
    constructor(canvas, imageRadus){
        this.canvas = canvas;
        this.gridScale = imageRadus;
        this.tacoLocation = {};
        this.initTaco()
    }

    initTaco() {
        // Add Taco on stage
        this.tacoLocation = {
            x: Math.floor(
                Math.random() *
                (this.canvas.width - this.gridScale) /
                this.gridScale
            ),
            y: Math.floor(
                Math.random() *
                (this.canvas.height - this.gridScale) /
                this.gridScale
            )
        };
    };
}