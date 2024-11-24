const board = document.querySelector('.board');
const restartBtn = document.getElementById('restart');
const attemptsDisplay = document.getElementById('attempts');
const congratsMessage = document.getElementById('congrats');
const roundHistory = document.getElementById('round-history');

// Imagens do jogo
const images = [
  'Ouroboros.png', 'Child13.png', 'Raven.png',
  'Ouroboros.png', 'Child13.png', 'Raven.png'
];

let shuffledImages = [];
let flippedCards = [];
let attempts = 0;
let pairsFound = 0;

// Função para embaralhar imagens
function shuffleImages() {
  shuffledImages = [...images];
  for (let i = shuffledImages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
  }
}

// Função para inicializar o jogo
function initGame() {
  shuffleImages();
  board.innerHTML = '';
  congratsMessage.classList.add('hidden');
  attempts = 0;
  pairsFound = 0;
  flippedCards = [];
  attemptsDisplay.textContent = `Tentativas: ${attempts}`;

  shuffledImages.forEach((image, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back" style="background-image: url('${image}')"></div>
      </div>
    `;

    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
  });
}

// Lógica para clique nas cartas
function handleCardClick(event) {
  const card = event.currentTarget;
  if (card.classList.contains('flipped') || flippedCards.length === 2) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    attempts++;
    attemptsDisplay.textContent = `Tentativas: ${attempts}`;
    localStorage.setItem('attempts', attempts);

    const [card1, card2] = flippedCards;
    const img1 = shuffledImages[card1.dataset.index];
    const img2 = shuffledImages[card2.dataset.index];

    if (img1 === img2) {
      pairsFound++;
      flippedCards = [];

      if (pairsFound === images.length / 2) {
        congratsMessage.classList.remove('hidden');
        updateHistory();
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
      }, 1000);
    }
  }
}

// Atualiza o histórico de tentativas
function updateHistory() {
  const round = document.createElement('li');
  round.textContent = `Rodada ${roundHistory.children.length + 1}: ${attempts} tentativas`;
  roundHistory.appendChild(round);
}

// Reinicia o jogo
restartBtn.addEventListener('click', () => {
  initGame();
});

// Inicializa o jogo ao carregar
initGame();
