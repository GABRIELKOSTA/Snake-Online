document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const BLOCK_SIZE = 20;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const SPEED = 100; // 100 ms (equivale a 10 fps)

    let snake;
    let direction;
    let food;
    let score;
    let gameInterval;
    const restartBtn = document.getElementById('restartBtn');

    function initGame() {
        snake = [
            { x: WIDTH / 2, y: HEIGHT / 2 },
            { x: WIDTH / 2 + BLOCK_SIZE, y: HEIGHT / 2 },
            { x: WIDTH / 2 + 2 * BLOCK_SIZE, y: HEIGHT / 2 }
        ];
        direction = 'RIGHT';
        food = getRandomFood();
        score = 0;
        restartBtn.style.display = 'none';
        if (gameInterval) clearInterval(gameInterval); // Limpa o intervalo anterior
        gameInterval = setInterval(gameLoop, SPEED);
    }

    function gameLoop() {
        moveSnake();
        if (checkCollision()) {
            endGame();
            return;
        }
        if (eatFood()) {
            score++;
            food = getRandomFood();
        } else {
            snake.pop(); // Remove a cauda se não comeu comida
        }

        drawGame();
    }

    function drawGame() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // Desenhar cobra
        snake.forEach(part => {
            ctx.fillStyle = 'green';
            ctx.fillRect(part.x, part.y, BLOCK_SIZE, BLOCK_SIZE);
        });

        // Desenhar comida
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, BLOCK_SIZE, BLOCK_SIZE);

        // Mostrar pontuação
        document.getElementById('score').textContent = `Score: ${score}`;
    }

    function moveSnake() {
        const head = { ...snake[0] };
        if (direction === 'UP') head.y -= BLOCK_SIZE;
        if (direction === 'DOWN') head.y += BLOCK_SIZE;
        if (direction === 'LEFT') head.x -= BLOCK_SIZE;
        if (direction === 'RIGHT') head.x += BLOCK_SIZE;

        snake.unshift(head); // Adiciona a nova cabeça
    }

    function checkCollision() {
        const head = snake[0];

        // Colisão com a parede
        if (head.x < 0 || head.x >= WIDTH || head.y < 0 || head.y >= HEIGHT) {
            return true;
        }

        // Colisão com o corpo da cobra
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }

        return false;
    }

    function eatFood() {
        const head = snake[0];
        return head.x === food.x && head.y === food.y;
    }

    function getRandomFood() {
        const x = Math.floor(Math.random() * (WIDTH / BLOCK_SIZE)) * BLOCK_SIZE;
        const y = Math.floor(Math.random() * (HEIGHT / BLOCK_SIZE)) * BLOCK_SIZE;
        return { x, y };
    }

    function changeDirection(event) {
        const key = event.keyCode;
        if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
        if (key === 38 && direction !== 'DOWN') direction = 'UP';
        if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
        if (key === 40 && direction !== 'UP') direction = 'DOWN';
    }

    function endGame() {
        clearInterval(gameInterval); // Para o jogo
        restartBtn.style.display = 'block';
        restartBtn.removeEventListener('click', restartGame); // Remove o listener antigo
        restartBtn.addEventListener('click', restartGame); // Adiciona um novo listener
    }

    function restartGame() {
        initGame(); // Reinicia o jogo
    }

    // Inicializa o jogo ao carregar a página
    initGame();
    document.addEventListener('keydown', changeDirection);
});
