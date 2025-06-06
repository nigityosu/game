const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const ballRadius = 15;
let x = canvas.width / 2;
let y = canvas.height / 2;
let speed = 4;

let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "ArrowUp") upPressed = true;
    else if (e.key === "ArrowDown") downPressed = true;
    else if (e.key === "ArrowLeft") leftPressed = true;
    else if (e.key === "ArrowRight") rightPressed = true;
}

function keyUpHandler(e) {
    if (e.key === "ArrowUp") upPressed = false;
    else if (e.key === "ArrowDown") downPressed = false;
    else if (e.key === "ArrowLeft") leftPressed = false;
    else if (e.key === "ArrowRight") rightPressed = false;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#ff5733";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();

    if (upPressed && y - ballRadius > 0) y -= speed;
    if (downPressed && y + ballRadius < canvas.height) y += speed;
    if (leftPressed && x - ballRadius > 0) x -= speed;
    if (rightPressed && x + ballRadius < canvas.width) x += speed;

    requestAnimationFrame(draw);
}
draw()