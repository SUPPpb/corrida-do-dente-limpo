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

    // Dentinho fixo no chão
    dente = {
      x: gameCanvas.width / 2 - 25,
      y: gameCanvas.height - 60,
      largura: 50,
      altura: 50,
      velocidade: 7
    };

    alimentos = gerarAlimentos();

    atualizar();
  }

  function gerarAlimentos() {
    const tipos = ['positivo', 'negativo', 'positivo'];
    return tipos.map(() => ({
      x: Math.random() * (gameCanvas.width - 30),
      y: -Math.random() * 200, // começa acima da tela
      tipo: Math.random() < 0.7 ? 'positivo' : 'negativo',
      imagem: null
    })).map(alimento => {
      alimento.imagem = alimento.tipo === 'negativo'
        ? imagemCarie
        : [imagemEscova, imagemFio, imagemPasta][Math.floor(Math.random() * 3)];
      return alimento;
    });
  }

  function atualizar() {
    if (!jogoAtivo) return;

    ctx.drawImage(imagemFundo, 0, 0, gameCanvas.width, gameCanvas.height);
    ctx.drawImage(imagemDente, dente.x, dente.y, dente.largura, dente.altura);

    alimentos.forEach(alimento => {
      alimento.y += 3; // cair do céu

      ctx.drawImage(alimento.imagem, alimento.x, alimento.y, 30, 30);

      const colidiu =
        alimento.x < dente.x + dente.largura &&
        alimento.x + 30 > dente.x &&
        alimento.y + 30 > dente.y;

      if (colidiu) {
        pontuacao += alimento.tipo === 'positivo' ? 1 : -1;

        if (pontuacao >= 5) {
          jogoAtivo = false;
          mostrarTelaFinal();
        }

        // Reinicia o alimento
        alimento.x = Math.random() * (gameCanvas.width - 30);
        alimento.y = -30;
        alimento.tipo = Math.random() < 0.7 ? 'positivo' : 'negativo';
        alimento.imagem = alimento.tipo === 'negativo'
          ? imagemCarie
          : [imagemEscova, imagemFio, imagemPasta][Math.floor(Math.random() * 3)];
      }

      // Caso passe da tela
      if (alimento.y > gameCanvas.height) {
        alimento.y = -30;
        alimento.x = Math.random() * (gameCanvas.width - 30);
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

  // Movimentação lateral com teclado
  window.addEventListener('keydown', e => {
    if (!jogoAtivo) return;

    if (e.key === 'ArrowLeft' && dente.x > 0) {
      dente.x -= dente.velocidade;
    } else if (e.key === 'ArrowRight' && dente.x < gameCanvas.width - dente.largura) {
      dente.x += dente.velocidade;
    }
  });
});
