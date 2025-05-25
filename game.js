document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const startScreen = document.getElementById('startScreen');
  const gameCanvas = document.getElementById('gameCanvas');
  const scoreElement = document.getElementById('score');
  const ctx = gameCanvas.getContext('2d');

  gameCanvas.width = 600;
  gameCanvas.height = 400;

  let dente, alimentos, pontuacao, jogoAtivo;

  // Imagens
  const imagemDente = new Image();
  imagemDente.src = 'assets/dentinho.png';

  const imagemFundo = new Image();
  imagemFundo.src = 'assets/fundo.png';

  const imagemCarie = new Image();
  imagemCarie.src = 'assets/carie.png';

  const imagemEscova = new Image();
  imagemEscova.src = 'assets/escova.png';

  const imagemFio = new Image();
  imagemFio.src = 'assets/fio_dental.png';

  const imagemPasta = new Image();
  imagemPasta.src = 'assets/pasta.png';

  const imagemFinal = new Image();
  imagemFinal.src = 'assets/dentista_final.png';

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
    const tipos = ['positivo', 'negativo', 'positivo', 'positivo'];
    return tipos.map((tipo, i) => ({
      x: 600 + i * 200,
      y: Math.random() * 300,
      tipo: tipo,
      imagem:
        tipo === 'negativo'
          ? imagemCarie
          : [imagemEscova, imagemFio, imagemPasta][Math.floor(Math.random() * 3)]
    }));
  }

  function atualizar() {
    if (!jogoAtivo) return;

    ctx.drawImage(imagemFundo, 0, 0, gameCanvas.width, gameCanvas.height);
    ctx.drawImage(imagemDente, dente.x, dente.y, dente.largura, dente.altura);

    alimentos.forEach(alimento => {
      alimento.x -= 3;
      ctx.drawImage(alimento.imagem, alimento.x, alimento.y, 30, 30);

      const colidiu =
        alimento.x < dente.x + dente.largura &&
        alimento.x + 30 > dente.x &&
        alimento.y < dente.y + dente.altura &&
        alimento.y + 30 > dente.y;

      if (colidiu) {
        if (alimento.tipo === 'positivo') {
          pontuacao++;
        } else {
          pontuacao--;
        }

        // Condição de vitória
        if (pontuacao >= 5) {
          jogoAtivo = false;
          mostrarTelaFinal();
        }

        alimento.x = 600 + Math.random() * 400;
        alimento.y = Math.random() * (gameCanvas.height - 30);
        alimento.tipo = Math.random() < 0.7 ? 'positivo' : 'negativo';
        alimento.imagem =
          alimento.tipo === 'negativo'
            ? imagemCarie
            : [imagemEscova, imagemFio, imagemPasta][Math.floor(Math.random() * 3)];
      }
    });

    scoreElement.textContent = `Pontuação: ${pontuacao}`;

    requestAnimationFrame(atualizar);
  }

  function mostrarTelaFinal() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.drawImage(imagemFinal, 0, 0, gameCanvas.width, gameCanvas.height);
    scoreElement.textContent = `Parabéns! Pontuação final: ${pontuacao}`;
  }

  window.addEventListener('keydown', e => {
    if (!jogoAtivo) return;

    if (e.key === 'ArrowUp' && dente.y > 0) {
      dente.y -= dente.velocidade;
    } else if (e.key === 'ArrowDown' && dente.y < gameCanvas.height - dente.altura) {
      dente.y += dente.velocidade;
    }
  });
});
