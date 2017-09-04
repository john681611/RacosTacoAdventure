
class Keyboard {

    constructor() {

        this.KeymapOpposite = {
            39: 37,
            40: 38,
            37: 39,
            38: 40
        };

        document.onkeydown = function (event) {
            this.pressKey = event.which;
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


class Raco {
    constructor(canvas, conf){
        this.canvas = canvas;
        this.stage = this.initStage(canvas, conf);
        this.initRaco();
        this.initTaco();

        return this;
    }

    initRaco() {
        // Itaration in Raco Conf
        for (let i = 0; i < this.stage.conf.tail; i++) {
            // Add Raco Cells
            this.stage.length.push({x: i, y: 0});
        }
    };

    initTaco() {
        // Add food on stage
        this.stage.food = {
            x: Math.floor(
                Math.random() *
                (this.canvas.width - this.stage.conf.cw) /
                this.stage.conf.cw
            ),
            y: Math.floor(
                Math.random() *
                (this.canvas.height - this.stage.conf.cw) /
                this.stage.conf.cw
            )
        };
    };

    initStage(conf) {
        this.keyEvent = new Keyboard();
        this.length = [];
        this.food = {};
        this.score = 0;
        this.direction = 39;
        this.conf = {
            cw: 50,
            tail: 4,
            fps: 30,
            size:100
        };

        // Merge Conf
        if (typeof conf === "object") {
            for (let key in conf) {
                if (conf.hasOwnProperty(key)) {
                    this.conf[key] = conf[key];
                }
            }
        }
        return this
    };

}


/**
 * Game Raco
 */
class Game {
    constructor(elementId) {
        // Sets
        this.canvas = document.getElementById(elementId);
        this.context = this.canvas.getContext("2d");
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
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    };

    Run(conf){
        window.addEventListener('resize', this.resizeCanvas(), false);
        this.resizeCanvas();
        this.raco = new Raco(this.canvas, conf);
        let self = this;
        document.onkeydown = function () {
            this.interval = setInterval(function () {
                console.log(self);
                self.drawStage();
            }, 1000 / this.raco.stage.conf.fps);
        };
    }

    drawStage() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        // Check Keypress And Set Stage direction
        let keyPress = this.raco.stage.keyEvent.getKey();
        if (keyPress && this.raco.stage.keyEvent.isOpposite(this.raco.stage.direction, keyPress)) {
            this.raco.stage.direction = keyPress;
        }

        // raco Position
        let nx = this.raco.stage.length[0].x;
        let ny = this.raco.stage.length[0].y;

        // Add position by stage direction
        switch (this.raco.stage.direction) {
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
        this.raco.stage.Lastdirection = this.raco.stage.direction;

        // Check Collision
        this.collision(nx, ny);

        // Logic of raco food
        let tail;
        if (nx === this.raco.stage.food.x && ny === this.raco.stage.food.y) {
            tail = {x: nx, y: ny};
            this.raco.stage.score++;
            this.raco.initTaco();
        } else {
            tail = this.raco.stage.length.pop();
            tail.x = nx;
            tail.y = ny;
        }
        this.raco.stage.length.unshift(tail);

        let head = this.raco.stage.length[0];
        // Draw raco
        for (let i = 1; i < this.raco.stage.length.length; i++) {
            let cell = this.raco.stage.length[i];
            this.draw(cell.x,cell.y,document.getElementById("taco"));
        }

        //Draw head
        this.draw(head.x,head.y,document.getElementById("head"));

        // Draw Food
        this.draw(this.raco.stage.food.x,this.raco.stage.food.y,document.getElementById("food"));
        // Draw Score
        this.context.fillText("Score: " + this.raco.stage.score, this.context.canvas.width/2, 50);
    };



    draw(x,y,img){
        this.context.drawImage(
            img,
            x * this.raco.stage.conf.cw + 6,
            y * this.raco.stage.conf.cw + 6,
            this.raco.stage.conf.size,
            this.raco.stage.conf.size
        );
    }
    // Check Collision with walls
    collision(nx, ny) {
        if (
            nx === -1 ||
            nx >= Math.floor(this.context.canvas.width / this.raco.stage.conf.cw) ||
            ny === -1 ||
            ny >= Math.floor(this.context.canvas.height / this.raco.stage.conf.cw)
        ) {
            this.fail(false);
        }
        for (let i = 4; i < this.raco.stage.length.length; i++) {
            let cell = this.raco.stage.length[i];
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
        }
        this.context.fillStyle = "red";
        this.context.font="72px  Lobster";
        this.context.textAlign= "center";
        clearInterval(this.interval);
        this.countdown(5);

        setTimeout(function(){
            racoGame = new Game.Raco("stage", {fps: 10, tail: 4});
        },5500);
    }
}

/**
 * Window Load
 */
window.onload = function() {
    racoGame = new Game("stage").Run({fps: 10, tail: 4});
}