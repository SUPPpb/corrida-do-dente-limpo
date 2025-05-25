const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');
const gameCanvas = document.getElementById('gameCanvas');
const scoreElement = document.getElementById('score');

const ctx = gameCanvas.getContext('2d');
gameCanvas.width = 600;
gameCanvas.height = 400;

let dente, alimentos, pontuacao, jogoAtivo;

startButton.addEventListener('click', iniciarJogo);

function iniciarJogo() {
    startScreen.style.display = 'none';
    gameCanvas.style.display = 'block';
    scoreElement.style.display = 'block';
    pontuacao = 0;
    jogoAtivo = true;
    dente = { x: 50, y: 200, largura: 50, altura: 50 };
    alimentos = gerarAlimentos();
    atualizar();
}

function gerarAlimentos() {
    return [
        { x: 600, y: 100, tipo: 'positivo' },
        { x: 900, y: 200, tipo: 'negativo' },
        { x: 1300, y: 150, tipo: 'positivo' }
    ];
}

function atualizar() {
    if (!jogoAtivo) return;

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    ctx.fillStyle = 'white';
    ctx.fillRect(dente.x, dente.y, dente.largura, dente.altura);

    alimentos.forEach(alimento => {
        alimento.x -= 3;
        ctx.fillStyle = alimento.tipo === 'positivo' ? 'green' : 'red';
        ctx.fillRect(alimento.x, alimento.y, 30, 30);

        if (
            alimento.x < dente.x + dente.largura &&
            alimento.x + 30 > dente.x &&
            alimento.y < dente.y + dente.altura &&
            alimento.y + 30 > dente.y
        ) {
            if (alimento.tipo === 'positivo') {
                pontuacao++;
            } else {
                pontuacao--;
            }
            alimento.x = 600 + Math.random() * 400;
            alimento.y = Math.random() * (gameCanvas.height - 30);
        }
    });

    scoreElement.textContent = `Pontuação: ${pontuacao}`;
    requestAnimationFrame(atualizar);
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && dente.y > 0) {
        dente.y -= 20;
    } else if (e.key === 'ArrowDown' && dente.y + dente.altura < gameCanvas.height) {
        dente.y += 20;
    }
});

gameCanvas.addEventListener('touchstart', function (e) {
    const touchY = e.touches[0].clientY - gameCanvas.getBoundingClientRect().top;
    if (touchY < dente.y) {
        dente.y -= 20;
    } else {
        dente.y += 20;
    }
});
