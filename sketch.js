let bird;
let HEIGHT = 650;
let WIDTH = 500  ;
let wallList = [];
let gameOver = false
let gameStart = false;
let score = 0;

function setup(){
    createCanvas(WIDTH,HEIGHT);
    bird = new Bird();
    wallList = [];
}

function draw(){
    background(0,0,0);
    
    bird.update();
    bird.display();
    drawWall();
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
        wall.display();
        if(collision(bird, wall)) {
            gameOver = true;
        }
    }
}

function keyPressed(){
    if (!gameOver){
        if (keyCode == 32){
            bird.dy  = -10 ;
            bird.acceleration = 0.6
        }
    }
    if (!gameStart && keyCode ==32){
        gameStart = true;
        let clock = setInterval(() => {
            let wall = new Wall();
            wallList.unshift(wall);
        }, 1500);
    }
}

class Wall{
    constructor(){
        this.variance = (random() - 0.5) * 300 ;
        this.thickness = 80;
        this.dx = 10;
        this.x = WIDTH;
        this.gap = 180 ;
        this.velocity = -2.2;
        this.pointGiven = false;
    }

    display(){
        rectMode(CORNERS);
        rect(this.x, 0, this.x + this.thickness, (HEIGHT / 2) - this.variance - this.gap / 2);
        rect(this.x, HEIGHT, this.x + this.thickness, (HEIGHT / 2) - this.variance + this.gap /2);
    }

    update(){
        this.x += this.velocity;
        if (this.x < 0 - this.thickness){
            return true;
        }
        if (this.x + this.thickness < WIDTH /2 ){
            if (!this.pointGiven){
                this.pointGiven = true;
                score++;
            }
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

    display(){
        ellipse(this.x, this.y, this.radius, this.radius);
    }
}

function collision(bird, wall){

    closest_x = bird.x;
    closest_y = bird.y;
    
    if (closest_x < wall.x){
        closest_x = wall.x;
    } else if (closest_x > wall.x + wall.thickness){
        closest_x = wall.x + wall.thickness;
    }

    if (closest_y > (HEIGHT / 2) - wall.variance - wall.gap / 2){
        closest_y = (HEIGHT / 2) - wall.variance - wall.gap / 2;
    }

    let distance = Math.pow(bird.x - closest_x, 2) + Math.pow(bird.y - closest_y, 2);
    if (distance > Math.pow((bird.radius / 2), 2)){
        closest_y = bird.y;
    if (closest_y < (HEIGHT / 2) - wall.variance + wall.gap / 2){
            closest_y = (HEIGHT / 2) - wall.variance + wall.gap / 2;
        }

        let distance = Math.pow(bird.x - closest_x, 2) + Math.pow(bird.y - closest_y, 2);
        return !(distance > Math.pow((bird.radius / 2), 2));

    } else{
        return true;
    }
}
