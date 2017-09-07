
class Keyboard {

    constructor() {

        this.KeymapOpposite = {
            39: 37,
            40: 38,
            37: 39,
            38: 40
        };
        let self  = this;
        document.onkeydown = function (event) {
            if(self.KeymapOpposite[event.which]) {
                self.pressKey = event.which;
            }
        };
        return this;
    }

    // Get Key
    getKey()
    {
        return this.pressKey
    }


    // Get Opposite
    isOpposite(current, nw)
    {
        return nw !== this.KeymapOpposite[current];
    }
}

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


class Raco {
    constructor(canvas) {
        this.canvas = canvas;
        this.length = [{x: 0, y: 0}];
        this.direction = 39;
        return this;
    }
}

class Screen{
    constructor(canvas,conf){
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.conf = conf;
    }

    updateData(raco, tacoLocation,score){
        this.raco = raco;
        this.tacoLocation = tacoLocation;
        this.score = score;
    }

    drawFrame() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        let head = this.raco.length[0];
        // Draw raco
        for (let i = 1; i < this.raco.length.length; i++) {
            let cell = this.raco.length[i];
            this.draw(cell.x,cell.y,document.getElementById("taco"));
        }

        this.draw(head.x,head.y,document.getElementById("head"));
        this.draw(this.tacoLocation.x,this.tacoLocation.y,document.getElementById("food"));
        this.context.fillText("Score: " + this.score, this.context.canvas.width/2, 50);
    };

    draw(x,y,img){
        this.context.drawImage(
            img,
            x * this.conf.imageRadus,
            y * this.conf.imageRadus,
            this.conf.size,
            this.conf.size
        );
    }

    countdownFrame(x,taco){
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.fillText(""+this.score, this.context.canvas.width/2 , this.context.canvas.height/2 - 80);
        if(taco){
            this.context.fillText("Oh No Raco Crushed A Taco!",this.context.canvas.width/2 , this.context.canvas.height/2);
        } else {
            this.context.fillText("Oh No, Raco Bashed His Nose!",this.context.canvas.width/2 , this.context.canvas.height/2);
        }
        this.context.fillText(x, this.context.canvas.width/2 , this.context.canvas.height/2+80);
        let self = this;
        setTimeout(function(){
            if (x>0){
                self.countdownFrame(x-1,taco);
            }
        },1000);
    };

    countdown(taco){
        this.context.fillStyle = "red";
        this.context.font="72px  Lobster";
        this.context.textAlign= "center";
        this.countdownFrame(5,taco);
    }

    prep() {
        window.addEventListener('resize', this.resizeCanvas(), false);
        this.resizeCanvas();
        this.context.textAlign = "center";
        this.context.fillStyle = "red";
        this.context.font = "72px  Lobster";
        this.context.fillText("Release The Raco!", this.context.canvas.width / 2, this.context.canvas.height / 2 - 50);
        this.context.font = "50px  Lobster";
        this.context.fillText("Press Any Button", this.context.canvas.width / 2, this.context.canvas.height / 2);
        this.context.drawImage(
            document.getElementById("head"),
            this.context.canvas.width / 2 - 200,
            this.context.canvas.height / 2 - 450,
            400,
            400
        );
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };

}


/**
 * Game Raco
 */
class Game {
    constructor(elementId) {
        // Sets
        this.canvas = document.getElementById(elementId);
    }

    processConfig(conf) {
        //defaults
        let conf2 = {
            fps: 59,
            size:100,
            imageRadus: 50,
        };
        // Merge Conf
        if (typeof conf === "object") {
            for (let key in conf2) {
                if (conf.hasOwnProperty(key)) {
                    conf2[key] = conf[key];
                }
            }
            this.conf = conf2;
        }
    };

    Run(conf){
        this.processConfig(conf);
        this.screen = new Screen(this.canvas,this.conf);
        this.raco = new Raco(this.canvas);
        this.stage = new Stage(this.canvas, this.conf.imageRadus);
        this.score = 0;
        this.screen.prep();
        let self = this;
        document.onkeydown = function () {
            self.keyEvent = new Keyboard();
            //Separate Intervals for rendering and processing
            self.processInterval = setInterval(function () {
                self.processFrame();
            }, 1000 / self.conf.fps);
            self.renderInterval = setInterval(function () {
                self.screen.drawFrame()
            }, 1000 / 60);


        };
    }

    processFrame(){
        // Check Keypress And Set Stage direction
        let keyPress = this.keyEvent.getKey();
        if (keyPress && this.keyEvent.isOpposite(this.raco.direction, keyPress)) {
            this.raco.direction = keyPress;
        }

        // raco Position
        let nx = this.raco.length[0].x;
        let ny = this.raco.length[0].y;

        // Add position by stage direction
        switch (this.raco.direction) {
            case 39:
                nx += 0.25;
                break;
            case 37:
                nx -= 0.25;
                break;
            case 38:
                ny -=0.25;
                break;
            case 40:
                ny+= 0.25;
                break;
        }
        this.raco.Lastdirection = this.raco.direction;

        // Check Collision
        this.collision(nx, ny);

        // Logic of raco Taco
        let tail;
        if (nx === this.stage.tacoLocation.x && ny === this.stage.tacoLocation.y) {
            tail = {x: nx, y: ny};
            this.score++;
            this.stage.initTaco();
        } else {
            tail = this.raco.length.pop();
            tail.x = nx;
            tail.y = ny;
        }
        this.raco.length.unshift(tail);
        this.screen.updateData(this.raco,this.stage.tacoLocation,this.score);
    }

    //WIP
    eatTaco(nx,ny) {
        let x = nx - this.stage.tacoLocation.x;
        let y = ny - this.stage.tacoLocation.y;
        x = x < -1 ? x * -1 : x;
        y = y < -1 ? y * -1 : y;
        return (x < 10 && y < 10);
    }


    // Check Collision with walls
    collision(nx, ny) {
        if (
            nx === -1 ||
            nx >= Math.floor(this.canvas.width / this.conf.imageRadus) ||
            ny === -1 ||
            ny >= Math.floor(this.canvas.height / this.conf.imageRadus)
        ) {
            this.fail(false);
            return;
        }
        for (let i = 4; i < this.raco.length.length; i++) {
            let cell = this.raco.length[i];
            if (cell.x === nx && cell.y === ny) {
                this.fail(true);
                return;
            }
        }
        return false;
    };

    fail(taco){
        clearInterval(this.processInterval);
        clearInterval(this.renderInterval);
        this.screen.countdown(taco);
        let self = this;
        setTimeout(function(){
            self.Run(self.conf);
        },5500);
    }
}

/**
 * Window Load
 */
window.onload = function() {
        racoGame = new Game("stage").Run({});
};