// Seleciona a área do jogo
const gameArea = document.querySelector("#game-container");
let playerElement;

// Definição de variáveis do jogo
let player, enemies, score, gameOver, lives, enemySpeed;

// Seleciona o botão de início
const startButton = document.getElementById("startButton");
const gameContainer = document.getElementById("game-container");
const gameover = document.getElementById("game-over");
const controls = document.querySelector(".controls");


// Função para iniciar o jogo
function startGame() {
    startButton.classList.add("hidden"); // Esconde o botão de início
    gameContainer.classList.remove("hidden"); // Mostra a área do jogo
    controls.classList.remove("hidden"); // Mostra os controles
    initializeGame(); // Inicializa o jogo
    gameLoop(); // Começa o loop do jogo
}

// Adiciona evento de clique no botão
startButton.addEventListener("click", startGame);

function startScore() {
    scoreInterval = setInterval(function() {
        score++; // Incrementa o tempo a cada segundo
        document.getElementById('score').textContent = "Pontuação: " + score + " | Vidas: "+ lives; // Atualiza a pontuação no HTML
    }, 1000); // Executa a cada 1000 milissegundos (1 segundo)
}

function stopScore() {
    // Salva a pontuação e exibe o recorde
    salvarPontuacao(score);
    let pontuacaoRecorde = localStorage.getItem("recorde");
    document.getElementById("pontuacao").innerHTML = "Pontuação: "+ score + " pontos";
    document.getElementById("recorde").textContent = `Recorde: ${pontuacaoRecorde} pontos`;

    clearInterval(scoreInterval); // Para o setInterval
}

function resetScore() {
    clearInterval(scoreInterval); // Para o cronômetro atual
    score = 0; // Reseta a pontuação
    document.getElementById('score').textContent = "Pontuação: " + score; // Atualiza o display para 0
    startScore(); // Inicia o cronômetro novamente
}

// Função para inicializar o jogo
function initializeGame() {
    player = {
        x: 375,
        y: 525,
        width: 50,
        height: 50,
        speed: 5,
        dx: 0,
        dy: 0,
    };
    enemies = [];
    score = 0;
    lives = 3;
    enemySpeed = 1.5;
    gameOver = false;

    // Configura o jogador
    playerElement = document.createElement("div");
    playerElement.id = "player";
    playerElement.style.width = `${player.width}px`;
    playerElement.style.height = `${player.height}px`;
    playerElement.style.backgroundColor = "green";
    playerElement.style.position = "absolute";
    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;
    gameArea.appendChild(playerElement);

    // Atualiza a pontuação
    updateScore();
    startScore();
}

// Função para salvar a pontuação
function salvarPontuacao(score) {
    let pontuacaoRecorde = localStorage.getItem("recorde");

    // Se o recorde não existe ou a pontuação atual for maior que o recorde, salva o novo recorde
    if (!pontuacaoRecorde || score > pontuacaoRecorde) {
        localStorage.setItem("recorde", score);
    }
}

// Função para mover o jogador
function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    let width = document.getElementById("game-container").offsetWidth;
    let height = document.getElementById("game-container").offsetHeight;

    // Impede o jogador de sair da área do jogo
    if (player.x < 0) player.x = 0;
    if (player.x > width - 50) player.x = width - 50;
    if (player.y < 0) player.y = 0;
    if (player.y > height - 50) player.y = height - 50;

    // Atualiza a posição do jogador
    playerElement.style.left = `${player.x}px`;
    playerElement.style.top = `${player.y}px`;
}

// Função para criar inimigos
function createEnemy() {
    let width = document.getElementById("game-container").offsetWidth;
    const enemy = {
        x: Math.random() * (width - 30),
        y: 0,
        width: 30,
        height: 30,
        speed: (Math.random() * 2) + 2,
    };
    enemies.push(enemy);

    // Cria o inimigo como um elemento HTML
    const enemyElement = document.createElement("div");
    enemyElement.classList.add("enemy");
    enemyElement.style.width = `${enemy.width}px`;
    enemyElement.style.height = `${enemy.height}px`;
    enemyElement.style.backgroundColor = "red";
    enemyElement.style.position = "absolute";
    enemyElement.style.left = `${enemy.x}px`;
    enemyElement.style.top = `${enemy.y}px`;
    gameArea.appendChild(enemyElement);
}

// Atualiza a posição de balas e inimigos
function updateElements() {
    // Atualizar inimigos
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;

        const enemyElement = gameArea.querySelectorAll(".enemy")[index];
        enemyElement.style.top = `${enemy.y}px`;

        // Remover inimigos fora da tela
        let height2 = document.getElementById("game-container").offsetHeight;

        if (enemy.y > height2) {
            enemies.splice(index, 1);
            enemyElement.remove();
        }

        // Verificar colisão com o jogador
        if (
            enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y
        ) {
            enemies.splice(index, 1); // Remove o inimigo que colidiu
            enemyElement.remove();
            lives -= 1; // Reduz as vidas do jogador
            updateScore();

            // Verifica se o jogo acabou
            if (lives <= 0) {
                stopScore();
                gameOver = true;
                gameOverScreen();
            }
        }
    });
}

function gameOverScreen() {
    const gameover = document.getElementById("game-over");
    const restartButton = document.getElementById("restartButton");
    gameover.classList.remove("hidden");
    restartButton.classList.remove("hidden");
    restartButton.style.zIndex = "101"; // Garante que o botão fique acima do overlay
}

// Função de reinício do jogo
function restartGame() {
    // Remove todos os elementos antigos
    document.querySelectorAll(".enemy").forEach((element) => element.remove());

    // Reinicia variáveis de estado
    enemies = [];
    score = 0;
    lives = 3;
    gameOver = false;

    // Atualiza o jogador para a posição inicial
    player.x = 375;
    player.y = 525;

    // Atualiza o texto da pontuação
    updateScore();
    startScore();

    // Oculta o botão de reinício
    const gameover = document.getElementById("game-over");
    const restartButton = document.getElementById("restartButton");
    gameover.classList.add("hidden");
    restartButton.classList.add("hidden");

    // Reinicia o loop do jogo
    gameLoop();
}

// Evento de clique no botão de reinício
document.getElementById("restartButton").addEventListener("click", restartGame);

// Atualiza a pontuação e vidas
function updateScore() {
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = `Pontuação: ${score} | Vidas: ${lives}`;
}

// Loop do jogo
function gameLoop() {
    if (!gameOver) {
        movePlayer();
        updateElements();
        requestAnimationFrame(gameLoop);
    }
}

// Controles de teclado
document.addEventListener("keydown", (e) => {
    if (e.key === "w") player.dy = -player.speed;
    if (e.key === "s") player.dy = player.speed;
    if (e.key === "a") player.dx = -player.speed;
    if (e.key === "d") player.dx = player.speed;
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") player.dy = -player.speed;
    if (e.key === "ArrowDown") player.dy = player.speed;
    if (e.key === "ArrowLeft") player.dx = -player.speed;
    if (e.key === "ArrowRight") player.dx = player.speed;
});

function move(direction) {
    switch (direction) {
        case 'up':
            player.dy = -player.speed;
            break;
        case 'down':
            player.dy = player.speed;
            break;
        case 'left':
            player.dx = -player.speed;
            break;
        case 'right':
            player.dx = player.speed;
            break;
    }
   
}

// Inicialização
initializeGame();
setInterval(createEnemy, 1000 - (scoreInterval*1,33 ));
gameLoop();
