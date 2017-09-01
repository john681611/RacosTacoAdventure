/**
 * Namespace
 */
var Game = Game || {};
var Keyboard = Keyboard || {};
var Component = Component || {};
var interval;

Keyboard.KeymapOpposite = {
    39: 37,
    40: 38,
    37: 39,
    38: 40
};

/**
 * Keyboard Events
 */
Keyboard.ControllerEvents = function () {
    // Setts
    var self = this;
    this.pressKey = null;
    this.KeymapOpposite = Keyboard.KeymapOpposite;

    // Keydown Event
    document.onkeydown = function (event) {
        self.pressKey = event.which;
    };

    // Get Key
    this.getKey = function () {
        return this.pressKey
    };

    // Get Opposite
    this.isOpposite = function (current, nw) {
        return nw !== this.KeymapOpposite[current];
    };
};

/**
 * Game Component Stage
 */
Component.Stage = function (canvas, conf) {
    // Sets
    this.keyEvent = new Keyboard.ControllerEvents();
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
        for (var key in conf) {
            if (conf.hasOwnProperty(key)) {
                this.conf[key] = conf[key];
            }
        }
    }
};

/**
 * Game Component Raco
 */
Component.Raco = function (canvas, conf) {
    // Game Stage
    this.stage = new Component.Stage(canvas, conf);

    // Init Raco
    this.initRaco = function () {
        // Itaration in Raco Conf
        for (var i = 0; i < this.stage.conf.tail; i++) {
            // Add Raco Cells
            this.stage.length.push({x: i, y: 0});
        }
    };

    // Call init Raco
    this.initRaco();

    // Init Food
    this.initTaco = function () {
        // Add food on stage
        this.stage.food = {
            x: Math.floor(
              Math.random() *
              (canvas.width - this.stage.conf.cw) /
              this.stage.conf.cw
            ),
            y: Math.floor(
              Math.random() *
              (canvas.height - this.stage.conf.cw) /
              this.stage.conf.cw
            )
        };
    };

    // Init Food
    this.initTaco();
};

/**
 * Game Draw
 */
Game.Draw = function (context, raco) {
    // Draw Stage
    this.drawStage = function () {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        // Check Keypress And Set Stage direction
        var keyPress = raco.stage.keyEvent.getKey();
        if (keyPress && raco.stage.keyEvent.isOpposite(raco.stage.direction, keyPress)) {
            raco.stage.direction = keyPress;
        }

        // raco Position
        var nx = raco.stage.length[0].x;
        var ny = raco.stage.length[0].y;

        // Add position by stage direction
        switch (raco.stage.direction) {
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
        raco.stage.Lastdirection = raco.stage.direction;

        // Check Collision
        this.collision(nx, ny,raco);

        // Logic of raco food
        var tail;
        if (nx === raco.stage.food.x && ny === raco.stage.food.y) {
             tail = {x: nx, y: ny};
            raco.stage.score++;
            raco.initTaco();
        } else {
             tail = raco.stage.length.pop();
            tail.x = nx;
            tail.y = ny;
        }
        raco.stage.length.unshift(tail);

        var head = raco.stage.length[0];
        // Draw raco
        for (var i = 1; i < raco.stage.length.length; i++) {
            var cell = raco.stage.length[i];
            this.draw(cell.x,cell.y,document.getElementById("taco"));
        }

        //Draw head
        this.draw(head.x,head.y,document.getElementById("head"));

        // Draw Food
        this.draw(raco.stage.food.x,raco.stage.food.y,document.getElementById("food"));
        // Draw Score
        context.fillText("Score: " + raco.stage.score, context.canvas.width/2, 50);
    };



    this.draw = function (x,y,img){
         context.drawImage(
            img,
            x * raco.stage.conf.cw + 6,
            y * raco.stage.conf.cw + 6,
            raco.stage.conf.size,
            raco.stage.conf.size
        );
    }
    // Check Collision with walls
    this.collision = function (nx, ny,raco) {
        if (
          nx === -1 ||
          nx >= Math.floor(context.canvas.width / raco.stage.conf.cw) ||
          ny === -1 ||
          ny >= Math.floor(context.canvas.height / raco.stage.conf.cw)
        ) {
            this.fail(raco,false);
        }
        for (var i = 4; i < raco.stage.length.length; i++) {
            var cell = raco.stage.length[i];
            if (cell.x === nx && cell.y === ny) {
                this.fail(raco,true);
            }
        }
        return false;
    };

    this.fail = function(raco,taco,self){

        this.countdown = function (x){
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            if(taco){
                context.fillText("Oh No Raco Crushed A Taco!",context.canvas.width/2 , context.canvas.height/2);
            } else {
                context.fillText("Oh No, Raco Bashed His Nose!",context.canvas.width/2 , context.canvas.height/2);
            }
            context.fillText(x, context.canvas.width/2 , context.canvas.height/2+80);
            var self = this;
            setTimeout(function(){
                    if (x>0){
                    self.countdown(x-1);
                }
            },1000);
        }
        context.fillStyle = "red";
        context.font="72px  Lobster";
        context.textAlign= "center";
        clearInterval(interval);
        this.countdown(5);

        setTimeout(function(){
            racoGame = new Game.Raco("stage", {fps: 10, tail: 4});
        },5500);
    }


};

/**
 * Game Raco
 */
Game.Raco = function (elementId, conf) {
    // Sets
    var raco,gameDraw;
    var canvas = document.getElementById(elementId);
    var context = canvas.getContext("2d");


    window.addEventListener('resize', this.resizeCanvas, false);

    this.resizeCanvas = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    this.resizeCanvas();
    context.textAlign= "center";
    context.fillStyle = "red";
    context.font="72px  Lobster";
    context.fillText("Release The Raco!",context.canvas.width/2 , context.canvas.height/2-50);
    context.font="50px  Lobster";
    context.fillText("Press Any Button",context.canvas.width/2  , context.canvas.height/2);

    var running = true;
    document.onkeydown = function (event) {
            raco = new Component.Raco(canvas, conf);
            gameDraw = new Game.Draw(context, raco);
            interval = setInterval(function () {
                gameDraw.drawStage();
            }, 1000 / raco.stage.conf.fps);
            running = false;
    };
};

/**
 * Window Load
 */
window.onload = function () {
    new Game.Raco("stage", {fps: 10, tail: 4});
};