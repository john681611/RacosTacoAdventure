class Stage {
    constructor(canvas, imageRadus){
        this.canvas = canvas;
        this.imageRadus = imageRadus;
        this.tacoLocation = {};
        this.initTaco()
    }

    initTaco() {
        // Add Taco on stage
        this.tacoLocation = {
            x: Math.floor(
                Math.random() *
                (this.canvas.width - this.imageRadus) /
                this.imageRadus
            ),
            y: Math.floor(
                Math.random() *
                (this.canvas.height - this.imageRadus) /
                this.imageRadus
            )
        };
    };
}