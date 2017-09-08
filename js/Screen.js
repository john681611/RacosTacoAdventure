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
            x * this.conf.gridScale,
            y * this.conf.gridScale,
            this.conf.imageSize,
            this.conf.imageSize
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