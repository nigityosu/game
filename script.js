const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
let life = 10;
let lifeDisplay = document.getElementById("lifeDisplay");
let isInvincible = false;
let speed = 5; // プレイヤーの移動速度
let balls = [];
let ballCount = 0; // 初期ボール数

function reloadPage() {
  location.reload();
}
document.getElementById("hardcore").addEventListener("click", hardcore);
function start() {
  document.getElementById("start").addEventListener("click", start);
  document.getElementById("start").style.display="none";
  document.getElementById("gameover").style.display="none";
  document.getElementById("rever").style.display="flex";
  console.log("ゲーム開始");
}// ゲーム開始
document.getElementById("ge").addEventListener("click", syokyuu);
document.getElementById("tyu").addEventListener("click", chukyu);
document.getElementById("jyo").addEventListener("click", jyoukyuu);
document.getElementById("soku").addEventListener("click", soku);
document.body.style.overflow = 'hidden';
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});
function syoki() {
  document.getElementById("rever").style.display="none";
  document.getElementById("gameover").style.display="none";
  updateLifeDisplay();
  playerBall.x = canvas.width / 2;
  playerBall.y = canvas.height / 2;
  draw(isPlayer = false);
}

function gameovera() {
  const screen = document.getElementById('gameover');
  screen.style.display = 'flex';
}// ゲームオーバー
function hardcore() {
  document.getElementById("rever").style.display="none";
  document.getElementById("gameover").style.display="none";
  document.getElementById("start").style.display="none";
  life = 1;
  speed = 10;
  ballCount = 50;
  balls = [];
  initializeBalls();
  activateInvincibility(1000);
}
  
function syokyuu(){
  syoki();
  ballCount = 15;
  balls = [];
  initializeBalls();
  life = 10;
  speed = 5; 
  activateInvincibility(1000);

}
function chukyu(){
  syoki();
  ballCount = 30;
  balls = [];
  initializeBalls();
  life = 10; 
  speed = 7; 
  activateInvincibility(1000);
}
function jyoukyuu(){
  syoki();
  ballCount = 60;
  balls = [];
  initializeBalls();
  life = 10;
  speed = 8; 
  activateInvincibility(1000);

}
function soku(){
  syoki();
  ballCount = 60;
  balls = [];
  initializeBalls();
  life = 1;
  speed = 10;
  activateInvincibility(1000);
}
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
      i--;
      life--;
      addBall();
      updateLifeDisplay();
      activateInvincibility();

      if (life <= 0) {
        updateLifeDisplay();
        initializeBalls();
        gameovera();
        return;
      }
    }
  }

  for (const ball of balls) {
    ball.update();
    ball.draw();
  }
  document.getElementById("reset").addEventListener("click", reloadPage);
  updatePlayerBall();
  playerBall.draw(true);

  requestAnimationFrame(draw);
}

initializeBalls();
updateLifeDisplay();
requestAnimationFrame(draw);
// ゲーム開始時にプレイヤーの位置を中央に設定