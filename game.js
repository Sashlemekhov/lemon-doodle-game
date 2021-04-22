const chooseHero = document.querySelector('.chooseHero');
const backdrop = document.querySelector('.backdrop');
const gameOverModal = document.getElementById('gameOverModal');
const restartBtn = document.getElementById('restartBtn');
const changeHeroBtn = document.getElementById('changeHeroBtn');
const result = document.querySelector('.result');
const grid = document.querySelector('.grid');

const doodler = document.createElement('img');
  
let hero;
let doodlerLeftSpace = 50;
let startPoint = 150;
let doodlerBottomSpace = startPoint;
let isGameOver = false;
let platformCount = 5;
let platforms = [];
let upTimerId;
let downTimerId;
let isJumping = true;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimerId;
let rightTimerId;
let score = 0;

function control(e) {
  doodler.style.bottom = doodlerBottomSpace + 'px';
  if (e.key === "ArrowLeft") {
    moveLeft();
  } else if (e.key === "ArrowRight") {
    moveRight();
  } else if (e.key === "ArrowUp") {
    moveStraight();
  }
};

function moveLeft() {
  if (hero === "lemehov") {
    doodler.setAttribute("src","./img/lemehov-left.png");
  };
  if (hero === "lisiy") {
    doodler.setAttribute("src","./img/lisiy-left.png");
  };
  if (hero === "vitala") {
    doodler.setAttribute("src","./img/vitala-left.png");
  };
  
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
  isGoingRight = false;
  isGoingLeft = true;

  if (isGoingRight) {
    clearInterval(rightTimerId);
    isGoingRight = false;
  };
  isGoingLeft = true;
  leftTimerId = setInterval(function () {
    if (doodlerLeftSpace >= 0) {
      doodlerLeftSpace -= 5;
      doodler.style.left = doodlerLeftSpace + 'px';
    } else moveRight()
  }, 20);
};

function moveRight() {

  if (hero === "lemehov") {
    doodler.setAttribute("src","./img/lemehov-right.png");
  };
  if (hero === "lisiy") {
    doodler.setAttribute("src","./img/lisiy-right.png");
  };
  if (hero === "vitala") {
    doodler.setAttribute("src","./img/vitala-right.png");
  };

  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
  isGoingLeft = false;
  isGoingRight = true;

  if (isGoingLeft) {
    clearInterval(leftTimerId);
    isGoingLeft = false;
  };
  isGoingRight = true;
  rightTimerId = setInterval(function () {
    if (doodlerLeftSpace <= 313) {
      doodlerLeftSpace += 5;
      doodler.style.left = doodlerLeftSpace + 'px';
    } else moveLeft()
  }, 20);
};

function moveStraight() {
  isGoingRight = false;
  isGoingLeft = false;
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
};

function createDoodler() {
  if (hero === "lemehov") {
    doodler.setAttribute("src","./img/lemehov-left.png");
  };
  if (hero === "lisiy") {
    doodler.setAttribute("src","./img/lisiy-left.png");
  };
  if (hero === "vitala") {
    doodler.setAttribute("src","./img/vitala-left.png");
  };
  grid.appendChild(doodler);
  doodler.classList.add('doodler');
  doodlerLeftSpace = platforms[0].left;
  doodler.style.left = doodlerLeftSpace + 'px';
  doodler.style.bottom = doodlerBottomSpace + 'px';
};

class Platform {
  constructor(newPlatformBottom) {
    this.bottom = newPlatformBottom;
    this.left = Math.random() * 315;
    this.visual = document.createElement('div');

    const visual = this.visual;
    visual.classList.add('platform');
    visual.style.left = this.left + 'px';
    visual.style.bottom = this.bottom + 'px';
    grid.appendChild(visual);
  };
};

function createPlatforms() {
  for (let i = 0; i < platformCount; i++) {
    let platformGap = 645 / platformCount;
    let newPlatformBottom = 100 + i * platformGap;
    let newPlatform = new Platform(newPlatformBottom)
    platforms.push(newPlatform);
  };
};

function movePlatforms() {
  if (doodlerBottomSpace > 200) {
    platforms.forEach(platform => {
      platform.bottom -= 4;
      let visual = platform.visual;
      visual.style.bottom = platform.bottom + 'px';
      doodler.style.bottom = doodlerBottomSpace + 'px';

      if (platform.bottom < 10) {
        let firstPlstform = platforms[0].visual;
        firstPlstform.classList.remove('platform');
        platforms.shift();
        score++;
        let newPlatform = new Platform(645);
        platforms.push(newPlatform);
      };
    });
  };
};
 
function jump() {
  clearInterval(downTimerId);
  isJumping = true;
  upTimerId = setInterval(function () {
    doodlerBottomSpace += 10;
    doodler.style.bottom = doodlerBottomSpace + 'px';
    if (doodlerBottomSpace > startPoint + 180) {
      fall();
      isJumping = false;
    }
  }, 30)
};

function fall() {
  isJumping = false;
  clearInterval(upTimerId);
  downTimerId = setInterval(function () {
    doodlerBottomSpace -= 5;
    doodler.style.bottom = doodlerBottomSpace + 'px';
    if (doodlerBottomSpace <= 0) {
      gameOver();
    }
    platforms.forEach(platform => {
      if (
        (doodlerBottomSpace >= platform.bottom) &&
        (doodlerBottomSpace <= (platform.bottom + 15)) &&
        ((doodlerLeftSpace + 60) >= platform.left) &&
        (doodlerLeftSpace <= (platform.left + 85)) &&
        !isJumping) {
        startPoint = doodlerBottomSpace;
        jump();
        isJumping = true;
      };
    });
  }, 20);
};

function gameOver() {
  isGameOver = true;
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  };
  gameOverModal.classList.remove('isHiden');
  
  result.innerHTML = score;
  clearInterval(upTimerId);
  clearInterval(downTimerId);
  clearInterval(leftTimerId);
  clearInterval(rightTimerId);
};

function start() {
  if (!isGameOver) {
    createPlatforms();
    createDoodler();
    setInterval(movePlatforms, 30);
    jump(startPoint);
    document.addEventListener('keydown', control);
  };
};

  

chooseHero.addEventListener('click', ((e) => {
  hero = e.target.name;
  if (!hero) {
    return;
  };
  backdrop.classList.add('isHiden');
  start();
}));

restartBtn.addEventListener('click', (() => {
  isGameOver = false;
  platforms = [];
  gameOverModal.classList.add('isHiden');
      start();
}));

changeHeroBtn.addEventListener('click', (() => {
  isGameOver = false;
  platforms = [];
  gameOverModal.classList.add('isHiden');
  backdrop.classList.remove('isHiden');
}));