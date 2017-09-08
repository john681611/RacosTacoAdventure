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