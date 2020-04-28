let bird;
let HEIGHT = 650;
let WIDTH = 500;
let wallList = [];
let gameOver;
let gameStart;
let score;
let birdImage;
let clock;
let bottomWallImage;
let topWallImage;
let backgroundImage;
let ground;
let scoreFont;
let reset;

function setup(){
    createCanvas(WIDTH,HEIGHT);
    reset = new Reset();
    reset.resetGame();
    loadImages();
    ground = new Ground();
}

function draw(){
    background(backgroundImage);
    
    drawBird()
    drawWall();
    drawGround();
    reset.draw();
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
    if (gameOver){
        reset.resetGame();
    }
}

function mouseReleased(){
    if (reset.resetButtonCheck(mouseX, mouseY)){
        reset.resetGame();
    }
}

function drawGround(){
    if (!gameOver){
        ground.update();
    }
    ground.draw();
}

function startGame(){
    gameStart = true;
    clock = setInterval(() => {
        let wall = new Wall();
        wallList.unshift(wall);
    }, 1500);
}

function loadImages(){
    scoreFont = loadFont("./assets/fonts/BACKTO1982.TTF")
    birdImage = loadImage("./assets/bird2.png")
    bottomWallImage = loadImage("./assets/bottomWall.png")
    topWallImage = loadImage("./assets/topWall.png")
    backgroundImage = loadImage("./assets/background1.png")
    groundImage = loadImage("./assets/ground.png") 
    scoreboardImage = loadImage("./assets/scoreboard.png")
    resetButton = loadImage("./assets/resetButton.png")
}

function drawBird(){
    bird.update();
    bird.draw();
}

function drawText(){
    push();
    fill(255,255,255)
    stroke(0,0,0)
    strokeWeight(5)
    textSize(40)
    textFont(scoreFont);
    textAlign(CENTER, CENTER)
    text(score, WIDTH / 2, 60);
    pop();
}

function drawWall(){
    for (let wall of wallList){
        if (!gameOver && wall.update()){
            wallList.pop();
        }
        wall.draw();
        if(wall.collision()) {
            endGame();
        }
    }
    if (gameOver){
        clearInterval(clock);
    }
}

function endGame(){
    gameOver = true
    reset.updateHighscore();
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
        this.center = 522 / 2 
    }

    draw(){
        push();
        rectMode(CORNERS);
        // rect(this.x, 0, this.x + this.thickness, this.center - this.variance - this.gap / 2);
        // rect(this.x, HEIGHT, this.x + this.thickness, this.center - this.variance + this.gap /2);
        image(bottomWallImage, this.x, this.center - this.variance + this.gap /2, this.thickness, 455)
        image(topWallImage, this.x, this.center - this.variance - this.gap / 2 - 455, this.thickness, 455)
        pop();
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
    
        if (closest_y > this.center - this.variance - this.gap / 2){
            closest_y = this.center - this.variance - this.gap / 2;
        }
    
        let distance = Math.pow(bird.x - closest_x, 2) + Math.pow(bird.y - closest_y, 2);
        if (distance > Math.pow((bird.radius / 2), 2)){
            closest_y = bird.y;
        if (closest_y < this.center - this.variance + this.gap / 2){
                closest_y = this.center - this.variance + this.gap / 2;
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
        this.bottomLimit = 522
    }

    update(){
        this.y += this.dy;
        this.dy += this.acceleration;
        if (this.y > this.bottomLimit - this.radius / 2){
            this.dy = 0;
            this.y = this.bottomLimit - this.radius / 2;
            endGame();
        }

    }

    draw(){
        // ellipse(this.x, this.y, this.radius, this.radius);
        image(birdImage, this.x - this.radius / 2, this.y- this.radius / 2, this.radius, this.radius)
    }

    jump(){
        this.dy  = -9 ;
        this.acceleration = 0.6
    }
}

class Ground{
    constructor(){
        this.groundList = [];
        this.x1 = 0;
        this.y = 522;
        this.dx = -2.2;
        this.x2 = WIDTH-43;
    }

    update(){
        this.x1 += this.dx;
        this.x2 += this.dx;
        if (this.x2 <= 0 && this.x1 <= this.x2){
            this.x1 = WIDTH - 43
        } else if (this.x1 <= 0 && this.x2 <= this.x1){
            this.x2 = WIDTH-43
        }
    }

    draw(){
        image(groundImage, this.x1, this.y)
        image(groundImage, this.x2, this.y)
    }
}

class Reset{
    constructor(){
        if (getItem("highscore")){
            this.highscore = getItem("highscore");
        } else {
            this.highscore = 0;
        }
            
    }

    draw(){
        if (gameOver){
            push(); 
            image(scoreboardImage, WIDTH/2 - 70, HEIGHT /2 - 160)
            fill(255,255,255)
            stroke(0,0,0)
            strokeWeight(5)
            textSize(22)
            textFont(scoreFont);
            textAlign(CENTER, CENTER)
            text(score, WIDTH / 2, HEIGHT /2 - 160 + 81);
            text(this.highscore, WIDTH / 2, HEIGHT /2 - 160 + 150);
            pop();
            image(resetButton, WIDTH/2 - 70, HEIGHT /2 + 100)
        } else{
            drawText()
        }
    }

    resetGame(){
        bird = new Bird();
        wallList = [];
        gameStart = false;
        gameOver = false;
        score = 0;
    }

    updateHighscore(){
        if (score > this.highscore){
            storeItem("highscore", score)
            this.highscore = score
        }
    }

    resetButtonCheck(x, y){
        return x <= WIDTH /2 +70 && x >= WIDTH / 2 -70 && y >= HEIGHT /2 + 100 && y <= HEIGHT / 2 +100 + 50 && gameOver; 
    }
}