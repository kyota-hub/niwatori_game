// DOM Elements
const elements = {
  player: document.querySelector('.player'),
  chicken: document.querySelector('.diamond'),
  scoreElem: document.getElementById('score'),
  timeLeftElem: document.getElementById('time-left'),
  gameIntro: document.querySelector('.game-intro'),
  startButton: document.getElementById('start-game'),
  gameArea: document.querySelector('.game-area'),
  gameOverScreen: document.querySelector('.game-over'),
  retryButton: document.getElementById('retry'),
  finalScoreElem: document.getElementById('final-score'),
  gameStats: document.querySelector('.game-stats'),
  moveButtons: document.querySelectorAll('.move-button'),
  gameControls: document.querySelector('.game-controls'),
  bgm: document.getElementById('bgm'),
  chickenSound: document.getElementById('chickenSound'),
  timeOverSound: document.getElementById('timeOver')
};

let score = 0;
let timeLeft = 20;
let gameInterval;

elements.startButton.addEventListener('click', startGame);
elements.retryButton.addEventListener('click', startGame);

function setDisplay(elements, value) {
  elements.forEach(elem => elem.style.display = value);
}

function startGame() {
  setDisplay([elements.gameIntro, elements.gameOverScreen], 'none');
  setDisplay([elements.gameArea, elements.gameStats, elements.scoreElem.parentElement, elements.timeLeftElem.parentElement, elements.gameControls], 'block');
  elements.gameControls.style.display = 'flex';

  elements.bgm.currentTime = 0;
  elements.bgm.play();

  resetGameStats();
  positionElementRandomly(elements.chicken);
  positionElementRandomly(elements.player);

  clearInterval(gameInterval);
  gameInterval = setInterval(function() {
      timeLeft--;
      elements.timeLeftElem.innerText = timeLeft;

      if (timeLeft <= 0) {
          endGame();
      }
  }, 1000);
}

function resetGameStats() {
  timeLeft = 20;
  score = 0;
  elements.scoreElem.innerText = score;
  elements.timeLeftElem.innerText = timeLeft;
  elements.player.textContent = "(・ω・)";
  elements.player.style.top = "0px";
  elements.player.style.left = "0px";
}

function endGame() {
  clearInterval(gameInterval);
  elements.bgm.pause();
  elements.timeOverSound.play();

  setDisplay([elements.gameArea, elements.scoreElem.parentElement, elements.timeLeftElem.parentElement, elements.gameControls], 'none');

  elements.finalScoreElem.textContent = `にわとり: ${score}ひき`;
  elements.gameOverScreen.style.display = 'flex';
}

document.addEventListener('keydown', handlePlayerMovement);

function handlePlayerMovement(event) {
  moveElementBasedOnKey(elements.player, event.key);
  moveElementBasedOnKey(elements.chicken, getRandomDirection());

  elements.player.textContent = "(・ω・)";
  checkCollision();
}

function moveElementBasedOnKey(element, arrowKey) {
  let top = parseInt(element.style.top || 0);
  let left = parseInt(element.style.left || 0);

  // Define the movements for each arrow key
  const movements = {
      "ArrowUp": { top: -20, left: 0 },
      "ArrowDown": { top: 20, left: 0 },
      "ArrowLeft": { top: 0, left: -20 },
      "ArrowRight": { top: 0, left: 20 },
  };

  if (movements[arrowKey]) {
      top += movements[arrowKey].top;
      left += movements[arrowKey].left;
  }

  setPositionWithinBounds(element, top, left);
}

function setPositionWithinBounds(element, top, left) {
  top = Math.min(Math.max(top, 0), 200);
  left = Math.min(Math.max(left, 0), 200);
  element.style.top = `${top}px`;
  element.style.left = `${left}px`;
}

function getRandomDirection() {
  const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  return directions[Math.floor(Math.random() * directions.length)];
}

function checkCollision() {
  const playerRect = elements.player.getBoundingClientRect();
  const chickenRect = elements.chicken.getBoundingClientRect();

  if (playerRect.left < chickenRect.right &&
      playerRect.right > chickenRect.left &&
      playerRect.top < chickenRect.bottom &&
      playerRect.bottom > chickenRect.top) {

      elements.chickenSound.currentTime = 0;
      elements.chickenSound.play();

      score++;
      elements.scoreElem.innerText = score;
      positionElementRandomly(elements.chicken);
      elements.player.textContent = "(∗˃̶ ᵕ ˂̶∗)";
  }
}

function positionElementRandomly(element) {
  element.style.top = `${Math.floor(Math.random() * 10) * 20}px`;
  element.style.left = `${Math.floor(Math.random() * 10) * 20}px`;
}

elements.moveButtons.forEach(button => {
  button.addEventListener('click', (e) => {
      const direction = e.target.getAttribute('data-direction');
      moveElementBasedOnKey(elements.player, direction);
      moveElementBasedOnKey(elements.chicken, getRandomDirection());
      elements.player.textContent = "(・ω・)"
      checkCollision();
  });
});
