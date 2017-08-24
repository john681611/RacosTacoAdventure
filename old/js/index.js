/**
 * Namespace
 */
var Game = Game || {};
var Keyboard = Keyboard || {};
var Component = Component || {};
var snake;

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

    //setKey
    this.setKey  = function (id) {
        self.pressKey= id;
    }

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
    this.width = canvas.width;
    this.height = canvas.height;
    this.length = [];
    this.food = {};
    this.score = 0;
    this.direction = 39;
    this.conf = {
        cw: 75,
        size: 4,
        imgSize: 100,
        fps: 60
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
 * Game Component Snake
 */
Component.Snake = function (canvas, conf) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Game Stage
    this.stage = new Component.Stage(canvas, conf);

    // Init Snake
    this.initSnake = function () {
        // Itaration in Snake Conf
        for (var i = 0; i < this.stage.conf.size; i++) {
            // Add Snake Cells
            this.stage.length.push({x: i, y: 0});
        }
    };

    // Call init Snake
    this.initSnake();

    // Init Food
    this.initFood = function () {
        // Add food on stage
        this.stage.food = {
            x: Math.floor(
              Math.random() *
              (this.stage.width - this.stage.conf.cw) /
              this.stage.conf.cw
            ),
            y: Math.floor(
              Math.random() *
              (this.stage.height - this.stage.conf.cw) /
              this.stage.conf.cw
            )
        };
    };

    // Init Food
    this.initFood();

    // Restart Stage
    this.restart = function () {
        this.stage.length = [];
        this.stage.food = {};
        this.stage.score = 0;
        this.stage.direction = 39;
        this.stage.keyEvent.pressKey = null;
        this.initSnake();
        this.initFood();
    };
};

/**
 * Game Draw
 */
Game.Draw = function (context, snake) {
    // Draw Stage
    this.drawStage = function () {
        // Check Keypress And Set Stage direction
        var keyPress = snake.stage.keyEvent.getKey();
        if (keyPress && snake.stage.keyEvent.isOpposite(snake.stage.direction, keyPress)) {
            snake.stage.direction = keyPress;
        }

        // Draw White Stage
        context.fillStyle = "white";
        context.fillRect(0, 0, snake.stage.width, snake.stage.height);

        // Snake Position
        var nx = snake.stage.length[0].x;
        var ny = snake.stage.length[0].y;

        // Add position by stage direction
        switch (snake.stage.direction) {
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
        snake.stage.Lastdirection = snake.stage.direction;

        // Check Collision
        if (this.collision(nx, ny) === true) {
            snake.restart();
            return;
        }

        // Logic of Snake food
        var tail;
        if (nx === snake.stage.food.x && ny === snake.stage.food.y) {
             tail = {x: nx, y: ny};
            snake.stage.score++;
            snake.initFood();
        } else {
             tail = snake.stage.length.pop();
            tail.x = nx;
            tail.y = ny;
        }
        snake.stage.length.unshift(tail);

        var head = snake.stage.length[0];
        // Draw Snake
        for (var i = 1; i < snake.stage.length.length; i++) {
            var cell = snake.stage.length[i];
            this.draw(cell.x,cell.y,document.getElementById("taco"));
        }

        //Draw head
        this.draw(head.x,head.y,document.getElementById("head"));

        // Draw Food
        this.draw(snake.stage.food.x,snake.stage.food.y,document.getElementById("food"));
        context.fillStyle = "blue";
        // Draw Score
        context.fillText("Score: " + snake.stage.score, 5, snake.stage.height - 5);
    };



    this.draw = function (x,y,img){
         context.drawImage(
          img,
          x * snake.stage.conf.cw + 6,
          y * snake.stage.conf.cw + 6,
          snake.stage.conf.imgSize,
          snake.stage.conf.imgSize
        );
    }
    // Check Collision with walls
    this.collision = function (nx, ny) {
        if (
          nx === -1 ||
          nx >= Math.floor(snake.stage.width / snake.stage.conf.cw) ||
          ny === -1 ||
          ny >= Math.floor(snake.stage.height / snake.stage.conf.cw)
        ) {
            return true;
        }
        for (var i = 4; i < snake.stage.length.length; i++) {
            var cell = snake.stage.length[i];
            if (cell.x === nx && cell.y === ny) {
                return true;
            }
        }
        return false;
    };
};

/**
 * Game Snake
 */
Game.Snake = function (elementId, conf) {
    // Sets
    var canvas = document.getElementById(elementId);
    var context = canvas.getContext("2d");
    var snake = new Component.Snake(canvas, conf);
    var gameDraw = new Game.Draw(context, snake);

    // Game Interval
    setInterval(function () {
        gameDraw.drawStage();
    }, snake.stage.conf.fps);
    return snake;
};

/**
 * Window Load
 */
window.onload = function () {
    snake = new Game.Snake("stage", {fps: 175, size: 4});
};