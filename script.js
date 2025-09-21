const board = document.getElementById("game-board");
const scoreEl = document.getElementById("score");

const obstacles = [
  { x: 5, y: 5 },
  { x: 6, y: 5 },
  { x: 7, y: 5 },
  { x: 14, y: 15 },
  { x: 15, y: 15 },
];


const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = randomPosition();
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
const highScoreEl = document.getElementById('high-score');
highScoreEl.textContent = highScore;

let gameOver = false;

function draw() {
  board.innerHTML = "";

  // desenha a comida
  const foodEl = createCell(food.x, food.y, "food");
  board.appendChild(foodEl);

  // desenha a cobra
  snake.forEach(segment => {
    const el = createCell(segment.x, segment.y, "snake");
    board.appendChild(el);
  });

  // desenha obstáculos
  obstacles.forEach(obs => {
    const el = createCell(obs.x, obs.y, "obstacle");
    board.appendChild(el);
  });
}



function createCell(x, y, className) {
  const cell = document.createElement("div");
  cell.classList.add("cell", className);
  cell.style.gridColumnStart = x;
  cell.style.gridRowStart = y;
  return cell;
}

function move() {
  if (gameOver) return;

  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // colisão com obstáculo (agora o head existe!)
  if (obstacles.some(o => o.x === head.x && o.y === head.y)) {
    endGame();
    return;
  }

  // checa colisão com parede
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    endGame();
    return;
  }

  // checa colisão com o próprio corpo
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snakeHighScore', highScore);
      highScoreEl.textContent = highScore;
    }

    food = randomPosition();
  } else {
    snake.pop();
  }

  draw();
}


function randomPosition() {
  return {
    x: Math.floor(Math.random() * gridSize) + 1,
    y: Math.floor(Math.random() * gridSize) + 1
  };
}

function endGame() {
  alert("Fim de jogo! Pontuação: " + score);
  gameOver = true;
}

document.addEventListener("keydown", e => {
  if (gameOver) return;

  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: 1, y: 0 };

  startGame(); // começa o jogo ao apertar qualquer direção
});

let interval;
let speed = 150; // padrão

function startGame() {
  if (!interval) {
    interval = setInterval(move, speed);
  }
}



function restartGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  food = randomPosition();
  score = 0;
  scoreEl.textContent = score;
  gameOver = false;

  draw();
  clearInterval(interval);
  interval = null;
}

draw();

const restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', restartGame);

document.querySelectorAll('#difficulty button').forEach(btn => {
  btn.addEventListener('click', () => {
    speed = Number(btn.dataset.speed);
    restartGame();
  });
});


document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('start-screen').style.display = 'none';
});
