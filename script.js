const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let life = 10;
let lifeDisplay = document.getElementById("lifeDisplay");
let isInvincible = false;

let balls = [];
let ballCount = 20;
function reset(){
  ballCount=20;
  
}

document.getElementById("pls").addEventListener("click", addBall);
document.getElementById("mis").addEventListener("click", removeBall);
class Ball {
  constructor(x, y, dx, dy, size, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.size = size;
    this.color = color;
  }

  update() {
    if (this.x + this.dx > canvas.width - this.size || this.x + this.dx < this.size) {
      this.dx = -this.dx;
    }
    if (this.y + this.dy > canvas.height - this.size || this.y + this.dy < this.size) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  draw(isPlayer = false) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    if (isPlayer) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000000";
      ctx.stroke();
      ctx.font = "12px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText("YOU", this.x, this.y - this.size - 8);
    }
    ctx.closePath();
  }
}

function createBall() {
  const size = 15;
  const x = Math.random() * (canvas.width - size * 2) + size;
  const y = Math.random() * (canvas.height - size * 2) + size;
  const dx = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1);
  const dy = (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1);
  const color = "#0095DD";
  return new Ball(x, y, dx, dy, size, color);
}

function initializeBalls() {
  balls = [];
  for (let i = 0; i < ballCount; i++) {
    balls.push(createBall());
  }
}

// プレイヤー
const playerBall = new Ball(canvas.width / 2, canvas.height / 2, 0, 0, 20, "#FF0000");

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

document.addEventListener("keydown", e => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

document.addEventListener("keyup", e => {
  if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

function updatePlayerBall() {
  const speed = 4;
  const r = playerBall.size;
  
  if (keys.ArrowUp && playerBall.y - r > 0) playerBall.y -= speed;
  if (keys.ArrowDown && playerBall.y + r < canvas.height) playerBall.y += speed;
  if (keys.ArrowLeft && playerBall.x - r > 0) playerBall.x -= speed;
  if (keys.ArrowRight && playerBall.x + r < canvas.width) playerBall.x += speed;
}

function checkCollision(b1, b2) {
  const dx = b1.x - b2.x;
  const dy = b1.y - b2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < b1.size + b2.size;
}

function resolveCollision(b1, b2) {
  const tempDx = b1.dx;
  const tempDy = b1.dy;
  b1.dx = b2.dx;
  b1.dy = b2.dy;
  b2.dx = tempDx;
  b2.dy = tempDy;
}

function activateInvincibility(duration = 1000) {
  isInvincible = true;
  setTimeout(() => {
    isInvincible = false;
  }, duration);
}

function updateLifeDisplay() {
  lifeDisplay.textContent = `ライフ: ${life}`;
}

function addBall() {
  balls.push(createBall());
}

function removeBall() {
  if (balls.length > 0) {
    balls.pop();
  }
}

let lastTime = 0;
const fps = 60;
const interval = 1000 / fps;

function draw(time) {
  if (time - lastTime < interval) {
    requestAnimationFrame(draw);
    return;
  }
  lastTime = time;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 衝突処理
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      if (checkCollision(balls[i], balls[j])) {
        resolveCollision(balls[i], balls[j]);
      }
    }

    if (checkCollision(balls[i], playerBall) && !isInvincible) {
      balls.splice(i, 1);
      i--;
      life--;
      updateLifeDisplay();
      activateInvincibility();

      if (life <= 0) {
        document.getElementById("gameover").style.display ="flex"
        ("ゲームオーバー！");
        life = 10;
        updateLifeDisplay();
        initializeBalls();
        return;
      }
    }
  }

  for (const ball of balls) {
    ball.update();
    ball.draw();
  }

  updatePlayerBall();
  playerBall.draw(true);

  requestAnimationFrame(draw);
}

initializeBalls();
updateLifeDisplay();
requestAnimationFrame(draw);