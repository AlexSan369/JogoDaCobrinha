const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');


class SnakePart{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

// PAUSE E RESTART

let paused = false;
let gameLoop;


// VELOCIDADE DO JOGO
let speed = 7;
let score = 0;

const sound = new Audio("gulp.mp3");


// TAMANHO DE CADA LADRILHO
// CANVAS = WIDTH 400/20 HEIGHT 400/20
const tileCount = 20;
const tileSize = canvas.width / tileCount - 2;

//POSIÇÃO DA CABEÇA DA COBRA
let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;

// POSIÇÃO DAS MAÇAS
let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;


// CHAMADA DO JOGO
function drawGame() {
    if(paused) {
        gameLoop = setTimeout(drawGame, 1000 / speed);
        return;
    }
    changeSnakePosition();
    let result = isGameOver();
    if(result){
        return
    }

    clearScreen();  
    
    checkAppleColision();
   
    drawApple();
    drawSnake();
    drawScore();
    
    gameLoop = setTimeout(drawGame, 1000 / speed);
}


function isGameOver() {
    let gameOver = false;

    //VERIFICANDO SE O JOGO STARTOU
    if(yVelocity === 0 && xVelocity === 0) {
        return false;
    }
    //PAREDES
    if(headX < 0 || headX === tileCount) {
        gameOver = true;
    } 
    else if ( headY < 0 || headY === tileCount) {
        gameOver = true; 
    }

    for(let i = 0; i <snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x == headX && part.y === headY){
            gameOver = true;
            break;
        }
    }

    if(gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "50px Verdana";
        ctx.fillText("Perdeu booy!", canvas.width / 7.5, canvas.height /2)
    }

    return gameOver;
}

// ESTILO DA TELA
function clearScreen() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}
// SNAKE ORIGIN
function drawSnake() {
   
    ctx.fillStyle = 'green';
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }

    snakeParts.push(new SnakePart(headX, headY));
    if(snakeParts.length > tailLength){
        snakeParts.shift();
    }

    ctx.fillStyle = 'purple';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)

}
// MOVIMENTANDO A COBRA
 function changeSnakePosition() {
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

function checkAppleColision() {
    if(appleX == headX && appleY == headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        tailLength++;
        score++;
        sound.play();
    }
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Score " + score, canvas.width-50, 15) 
}


function keyDown(event) {
    
    //UP
    if(event.keyCode == 38) {
        if(yVelocity == 1)
            return;
        yVelocity = -1;
        xVelocity = 0;
    }
    
    //DOWN
    if(event.keyCode == 40) {
        if(yVelocity == -1)
            return;
        yVelocity = 1;
        xVelocity = 0;
    }
    
    //RIGHT
    if(event.keyCode == 39) {
        if(xVelocity == -1)
            return;
        yVelocity = 0;
        xVelocity = 1;
    }
    
    //LEFT
    if(event.keyCode == 37) {
        if(xVelocity == 1)
            return;
        yVelocity = 0;
        xVelocity = -1;
    }
}

function togglePause() {

    if (paused) {
        gameLoop = setTimeout(drawGame, 1000 / speed);
        paused = false;
    } else {
        clearTimeout(gameLoop);
        paused = true;
    }
}

function restartGame() {
    
    clearTimeout(gameLoop);
    paused = false;
    headX = 10;
    headY = 10;
    snakeParts = [];
    tailLength = 2;
    appleX = 5;
    appleY = 5;
    xVelocity = 0;
    yVelocity = 0;
    score = 0;
    gameLoop = setTimeout(drawGame, 1000 / speed);
}

//EVENTOS
const pauseButton = document.getElementById("pause-button");
const restartButton = document.getElementById("restart-button");

pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", restartGame);

document.body.addEventListener('keydown', keyDown);

drawGame();