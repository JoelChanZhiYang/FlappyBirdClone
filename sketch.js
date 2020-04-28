let bird;
let HEIGHT = 650;
let WIDTH = 500  ;
let wallList = [];
let gameOver = false
let gameStart = false;
let score = 0;
let birdImage;
let clock;

function setup(){
    createCanvas(WIDTH,HEIGHT);
    bird = new Bird();
    wallList = [];
    loadImages();
}

function draw(){
    background(25,25,25);
    
    drawBird()
    drawWall();
    drawText();
}

function keyPressed(){
    if (!gameOver){
        if (keyCode == 32){
            bird.jump();
        }
    }
    if (!gameStart && keyCode ==32){
        startGame();
    }
}

function startGame(){
    gameStart = true;
    clock = setInterval(() => {
        let wall = new Wall();
        wallList.unshift(wall);
    }, 1500);
}


function loadImages(){
    birdImage = loadImage("./bird2.png")
}

function drawBird(){
    bird.update();
    bird.draw();
}

function drawText(){
    fill(255,0,0)
    textSize(32)
    text(score, WIDTH / 2, 30);
    fill(255,255,255)
}

function drawWall(){
    for (let wall of wallList){
        if (!gameOver && wall.update()){
            wallList.pop();
        }
        wall.draw();
        if(wall.collision()) {
            gameOver = true;
        }
    }
    if (gameOver){
        clearInterval(clock);
    }
}

class Wall{
    constructor(){
        this.variance = (random() - 0.5) *  250 ;
        this.thickness = 80;
        this.dx = 10;
        this.x = WIDTH;
        this.gap = 180 ;
        this.velocity = -2.2;
        this.pointGiven = false;
    }

    draw(){
        rectMode(CORNERS);
        rect(this.x, 0, this.x + this.thickness, (HEIGHT / 2) - this.variance - this.gap / 2);
        rect(this.x, HEIGHT, this.x + this.thickness, (HEIGHT / 2) - this.variance + this.gap /2);
    }

    update(){
        this.x += this.velocity;
        this.updatePoints();
        return this.deletionCheck();
    }

    deletionCheck(){
        return this.x < 0 - this.thickness
    }

    updatePoints(){
        if (this.x + this.thickness < WIDTH /2 ){
            if (!this.pointGiven){
                this.pointGiven = true;
                score++;
            }
        }
    }

    collision(){
        let closest_x = bird.x;
        let closest_y = bird.y;
        
        if (closest_x < this.x){
            closest_x = this.x;
        } else if (closest_x > this.x + this.thickness){
            closest_x = this.x + this.thickness;
        }
    
        if (closest_y > (HEIGHT / 2) - this.variance - this.gap / 2){
            closest_y = (HEIGHT / 2) - this.variance - this.gap / 2;
        }
    
        let distance = Math.pow(bird.x - closest_x, 2) + Math.pow(bird.y - closest_y, 2);
        if (distance > Math.pow((bird.radius / 2), 2)){
            closest_y = bird.y;
        if (closest_y < (HEIGHT / 2) - this.variance + this.gap / 2){
                closest_y = (HEIGHT / 2) - this.variance + this.gap / 2;
            }
    
            let distance = Math.pow(bird.x - closest_x, 2) + Math.pow(bird.y - closest_y, 2);
            return !(distance > Math.pow((bird.radius / 2), 2));
    
        } else{
            return true;
        }
    }
}
 
class Bird{
    constructor(){
        this.y = HEIGHT / 2;
        this.x = WIDTH / 2;
        this.radius = 45  ;
        this.dy = 0;
        this.acceleration = 0 ;
    }

    update(){
        this.y += this.dy;
        this.dy += this.acceleration;
        if (this.y > HEIGHT - this.radius / 2){
            this.dy = 0;
            this.y = HEIGHT - this.radius / 2;
        }
    }

    draw(){
        // ellipse(this.x, this.y, this.radius, this.radius);
        image(birdImage, this.x - this.radius / 2, this.y- this.radius / 2, this.radius, this.radius)
    }

    jump(){
        this.dy  = -10 ;
        this.acceleration = 0.6
    }
}