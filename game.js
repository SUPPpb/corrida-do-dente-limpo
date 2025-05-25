const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');
const gameCanvas = document.getElementById('gameCanvas');
const scoreElement = document.getElementById('score');

const ctx = gameCanvas.getContext('2d');
gameCanvas.width = 600;
gameCanvas.height = 400;

let dente, alimentos, pontuacao, jogoAtivo;

// Carregando imagens
const imagemFundo = new Image();
imagemFundo.src = 'assets/fundo.png';

const imagemDente = new Image();
imagemDente.src = 'assets/dentinho.png';

const imagemCarie = new Image();
imagemCarie.src = 'assets/carie.png';

const imagemEscova = new Image();
imagemEscova.src = 'assets/escova.png';

const imagemFioDental = new Image();
imagemFioDental.src = 'assets/fio_dental.png';

const imagemPasta = new Image();
imagemPasta.src = 'assets/pasta.png';

const imagemVitoria = new Image();
imagemVitoria.src = 'assets/dentista_final.png';

startButton.addEventListener('click', iniciarJogo);

function iniciarJogo() {
  startScreen.style.display = 'none';
  gameCanvas.style.display = 'block';
  scoreElement.style.display = 'block';
  
  pontuacao = 0;
  jogoAtivo = true;

  dente = { x: 50, y: 200, largura: 50, altura: 50, velocidade: 5 };
  alimentos = gerarAlimentos();

  atualizar();
}

function gerarAlimentos() {
  const tiposPositivos = ['escova', 'fio_dental', 'pasta'];
  return [
    { x: 600, y: 100, tipo: 'positivo', subtipo: tiposPositivos[0] },
    { x: 800, y: 200, tipo: 'negativo' },
    { x: 1000, y: 150, tipo: 'positivo', subtipo: tiposPositivos[1] }
  ];
}

function atualizar() {
  if (!jogoAtivo) return;

  ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  // Fundo
  ctx.drawImage(imagemFundo, 0, 0, gameCanvas.width, gameCanvas.height);

  // Personagem
  ctx.drawImage(imagemDente, dente.x, dente.y, dente.largura, dente.altura);

  // Itens
  alimentos.forEach(alimento => {
    alimento.x -= 3;

    let imagem;
    if (alimento.tipo === 'negativo') {
      imagem = imagemCarie;
    } else {
      if (alimento.subtipo === 'escova') imagem = imagemEscova;
      else if (alimento.subtipo === 'fio_dental') imagem = imagemFioDental;
      else if (alimento.subtipo === 'pasta') imagem = imagemPasta;
    }

    ctx.drawImage(imagem, alimento.x, alimento.y, 30, 30);

    if (
      alimento.x < dente.x + dente.largura &&
      alimento.x + 30 > dente.x &&
      alimento.y < dente.y + dente.altura &&
      alimento.y + 30 > dente.y
    ) {
      if (alimento.tipo === 'positivo') {
        pontuacao++;
        if (pontuacao >= 5) {
          mostrarTelaVitoria();
          return;
        }
      } else {
        pontuacao--;
      }

      // Reposiciona o item
      const tiposPositivos = ['escova', 'fio_dental', 'pasta'];
      alimento.x = 600 + Math.random() * 400;
      alimento.y = Math.random() * (gameCanvas.height - 3*
