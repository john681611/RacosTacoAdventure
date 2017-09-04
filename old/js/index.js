
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
            self.pressKey = event.which;
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
    constructor(canvas, cw){
        this.canvas = canvas;
        this.cw = cw;
        this.tacoLocation = {};
        this.initTaco()
    }

    initTaco() {
        // Add Taco on stage
        this.tacoLocation = {
            x: Math.floor(
                Math.random() *
                (this.canvas.width - this.cw) /
                this.cw
            ),
            y: Math.floor(
                Math.random() *
                (this.canvas.height - this.cw) /
                this.cw
            )
        };
    };
}


class Raco {
    constructor(canvas){
        this.canvas = canvas;
        this.length = [{x: 0, y: 0}];
        this.direction = 39;
        return this;
    }
}


/**
 * Game Raco
 */
class Game {
    constructor(elementId) {
        // Sets
        this.canvas = document.getElementById(elementId);
        this.context = this.canvas.getContext("2d");
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };

    processConfig(conf) {
        let conf2 = {
            cw: 50,
            fps: 15,
            size:100
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
        this.raco = new Raco(this.canvas);
        this.stage = new Stage(this.canvas, this.conf.cw);
        this.score = 0;
        window.addEventListener('resize', this.resizeCanvas(), false);
        this.resizeCanvas();
        this.context.textAlign= "center";
        this.context.fillStyle = "red";
        this.context.font="72px  Lobster";
        this.context.fillText("Release The Raco!",this.context.canvas.width/2 , this.context.canvas.height/2-50);
        this.context.font="50px  Lobster";
        this.context.fillText("Press Any Button",this.context.canvas.width/2  , this.context.canvas.height/2);
        this.context.drawImage(
            document.getElementById("head"),
            this.context.canvas.width/2-200,
            this.context.canvas.height/2-450,
            400,
            400
        );

        let self = this;
        document.onkeydown = function () {
            self.keyEvent = new Keyboard();
            self.interval = setInterval(function () {
                self.drawStage();
            }, 1000 / self.conf.fps);
        };
    }

    drawStage() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
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
                nx++;
                break;
            case 37:
                nx--;
                break;
            case 38:
                ny--;
                break;
            case 40:
                ny++;
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

        let head = this.raco.length[0];
        // Draw raco
        for (let i = 1; i < this.raco.length.length; i++) {
            let cell = this.raco.length[i];
            this.draw(cell.x,cell.y,document.getElementById("taco"));
        }

        //Draw head
        this.draw(head.x,head.y,document.getElementById("head"));

        // Draw Taco
        this.draw(this.stage.tacoLocation.x,this.stage.tacoLocation.y,document.getElementById("food"));
        // Draw Score
        this.context.fillText("Score: " + this.score, this.context.canvas.width/2, 50);
    };



    draw(x,y,img){
        this.context.drawImage(
            img,
            x * this.conf.cw + 6,
            y * this.conf.cw + 6,
            this.conf.size,
            this.conf.size
        );
    }
    // Check Collision with walls
    collision(nx, ny) {
        if (
            nx === -1 ||
            nx >= Math.floor(this.context.canvas.width / this.conf.cw) ||
            ny === -1 ||
            ny >= Math.floor(this.context.canvas.height / this.conf.cw)
        ) {
            this.fail(false);
        }
        for (let i = 4; i < this.raco.length.length; i++) {
            let cell = this.raco.length[i];
            if (cell.x === nx && cell.y === ny) {
                this.fail(true);
            }
        }
        return false;
    };

    fail(taco){

        this.countdown = function (x){
            this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
            if(taco){
                this.context.fillText("Oh No Raco Crushed A Taco!",this.context.canvas.width/2 , this.context.canvas.height/2);
            } else {
                this.context.fillText("Oh No, Raco Bashed His Nose!",this.context.canvas.width/2 , this.context.canvas.height/2);
            }
            this.context.fillText(x, this.context.canvas.width/2 , this.context.canvas.height/2+80);
            let self = this;
            setTimeout(function(){
                if (x>0){
                    self.countdown(x-1);
                }
            },1000);
        };
        this.context.fillStyle = "red";
        this.context.font="72px  Lobster";
        this.context.textAlign= "center";
        clearInterval(this.interval);
        this.countdown(5);
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
    racoGame = new Game("stage").Run({fps: 10});
};