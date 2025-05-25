// game.js atualizado com escala responsiva
const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');
const gameCanvas = document.getElementById('gameCanvas');
const scoreElement = document.getElementById('score');
const ctx = gameCanvas.getContext('2d');

let escala = 1;
let dente, alimentos, pontuacao, jogoAtivo;

const imagemDente = new Image();
imagemDente.src = 'assets/dentinho.png';

const imagemFundo = new Image();
imagemFundo.src = 'assets/fundo.png';

const imagensItens = {
  positivo: [
    'assets/escova.png',
    'assets/fio_dental.png',
    'assets/pasta.png'
  ].map(src => {
    const img = new Image();
    img.src = src;
    return img;
  }),
  negativo: (() => {
    const img = new Image();
    img.src = 'assets/carie.png';
    return img;
  })()
};

function ajustarCanvas() {
  const larguraPadrao = 600;
  const alturaPadrao = 400;
  const larguraDisponivel = window.innerWidth * 0.9;
  escala = larguraDisponivel >= larguraPadrao ? 1 : larguraDisponivel / larguraPadrao;

  gameCanvas.width = larguraPadrao * escala;
  gameCanvas.height = alturaPadrao * escala;
}

startButton.addEventListener('click', iniciarJogo);

function iniciarJogo() {
  ajustarCanvas();
  startScreen.style.display = 'none';
  gameCanvas.style.display = 'block';
  scoreElement.style.display = 'block';

  pontuacao = 0;
  jogoAtivo = true;

  dente = {
    x: (600 / 2 - 25) * escala,
    y: (400 - 110) * escala,
    largura: 50 * escala,
    altura: 50 * escala,
    velocidade: 10 * escala
  };

  alimentos = gerarAlimentos();
  atualizar();
}

function gerarAlimentos() {
  return Array.from({ length: 3 }, () => criarAlimento());
}

function criarAlimento() {
  const tipo = Math.random() < 0.7 ? 'positivo' : 'negativo';
  return {
    x: Math.random() * (600 - 30) * escala,
    y: -30 * escala,
    tipo: tipo,
    imagem: tipo === 'positivo'
      ? imagensItens.positivo[Math.floor(Math.random() * imagensItens.positivo.length)]
      : imagensItens.negativo
  };
}

function atualizar() {
  if (!jogoAtivo) return;

  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  ctx.drawImage(imagemFundo, 0, 0, gameCanvas.width, gameCanvas.height);
  ctx.drawImage(imagemDente, dente.x, dente.y, dente.largura, dente.altura);

  alimentos.forEach(alimento => {
    alimento.y += 3 * escala;
    ctx.drawImage(alimento.imagem, alimento.x, alimento.y, 30 * escala, 30 * escala);

    if (
      alimento.x < dente.x + dente.largura &&
      alimento.x + 30 * escala > dente.x &&
      alimento.y < dente.y + dente.altura &&
      alimento.y + 30 * escala > dente.y
    ) {
      pontuacao += alimento.tipo === 'positivo' ? 1 : -1;
      Object.assign(alimento, criarAlimento());
    }

    if (alimento.y > gameCanvas.height) {
      Object.assign(alimento, criarAlimento());
    }
  });

  scoreElement.textContent = `Pontuação: ${pontuacao}`;
  requestAnimationFrame(atualizar);
}

window.addEventListener('keydown', moverDente);

function moverDente(e) {
  if (!jogoAtivo) return;

  if (e.key === 'ArrowLeft' && dente.x > 0) {
    dente.x -= dente.velocidade;
  } else if (e.key === 'ArrowRight' && dente.x < gameCanvas.width - dente.largura) {
    dente.x += dente.velocidade;
  }
}

document.getElementById('btnEsquerda').addEventListener('click', () => {
  if (jogoAtivo && dente.x > 0) {
    dente.x -= dente.velocidade;
  }
});

document.getElementById('btnDireita').addEventListener('click', () => {
  if (jogoAtivo && dente.x < gameCanvas.width - dente.largura) {
    dente.x += dente.velocidade;
  }
});
