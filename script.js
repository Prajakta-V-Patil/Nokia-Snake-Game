const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const info = document.getElementById('info');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const restartButton = document.getElementById('restart-button');

const GRID_SIZE = 20;
const GRID_WIDTH = canvas.width / GRID_SIZE;
const GRID_HEIGHT = canvas.height / GRID_SIZE;
const LEVELS = 5;
let snake, snakeDirection, food, gameInterval, score, level;

// Ensure the canvas or container gets focus
canvas.setAttribute('tabindex', 0);
canvas.focus();

function startGame() {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    canvas.style.display = 'block';
    score = 0;
    level = 1;
    initializeGame();
}

function initializeGame() {
    snake = [{ x: 10, y: 10 }];
    snakeDirection = { x: 1, y: 0 };
    food = { x: Math.floor(Math.random() * GRID_WIDTH), y: Math.floor(Math.random() * GRID_HEIGHT) };
    scoreElement.textContent = `Score: ${score}`;
    levelElement.textContent = `Level: ${level}`;
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 1000 / (level * 5));
}

function drawSnake() {
    for (let segment of snake) {
        ctx.fillStyle = 'green';
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        ctx.clearRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    }
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

function moveSnake() {
    const newHead = { x: snake[0].x + snakeDirection.x, y: snake[0].y + snakeDirection.y };
    snake.unshift(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        if (score % 50 === 0 && level < LEVELS) {
            level++;
            levelElement.textContent = `Level: ${level}`;
        }
        food = { x: Math.floor(Math.random() * GRID_WIDTH), y: Math.floor(Math.random() * GRID_HEIGHT) };
    } else {
        snake.pop();
    }
}

function checkCollision() {
    if (snake[0].x < 0 || snake[0].x >= GRID_WIDTH || snake[0].y < 0 || snake[0].y >= GRID_HEIGHT) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function updateGame() {
    if (checkCollision()) {
        gameOver();
        return;
    }
    moveSnake();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
}

function gameOver() {
    clearInterval(gameInterval);
    startScreen.style.display = 'block';
    gameContainer.style.display = 'none';
    canvas.style.display = 'none';
    startButton.textContent = 'Play Again';
    startButton.addEventListener('click', startGame); // Use `addEventListener` instead of `onclick`
}

startButton.addEventListener('click', startGame); // Use `addEventListener` for the start button
restartButton.onclick = initializeGame;

// Add event listener for arrow keys
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && snakeDirection.y !== 1) {
        snakeDirection = { x: 0, y: -1 };
    } else if (event.key === 'ArrowDown' && snakeDirection.y !== -1) {
        snakeDirection = { x: 0, y: 1 };
    } else if (event.key === 'ArrowLeft' && snakeDirection.x !== 1) {
        snakeDirection = { x: -1, y: 0 };
    } else if (event.key === 'ArrowRight' && snakeDirection.x !== -1) {
        snakeDirection = { x: 1, y: 0 };
    }
});
