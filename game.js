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
      y: Math.r
