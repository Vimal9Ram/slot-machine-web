// Vector SVG Symbols (Planet, Core, Star, Comet, Satellite, Alien)
const SYMBOLS = [
  { name: 'Planet', svg: `<svg class="symbol-icon" viewBox="0 0 24 24"><path fill="#f59e0b" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>` },
  { name: 'Core', svg: `<svg class="symbol-icon" viewBox="0 0 24 24"><path fill="#06b6d4" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/></svg>` },
  { name: 'Star', svg: `<svg class="symbol-icon" viewBox="0 0 24 24"><path fill="#ec4899" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>` },
  { name: 'Comet', svg: `<svg class="symbol-icon" viewBox="0 0 24 24"><path fill="#8b5cf6" d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12"/></svg>` },
  { name: 'Satellite', svg: `<svg class="symbol-icon" viewBox="0 0 24 24"><path fill="#10b981" d="M12 2L2 22h20L12 2z"/></svg>` },
  { name: 'Alien', svg: `<svg class="symbol-icon" viewBox="0 0 24 24"><path fill="#ef4444" d="M12 2a6 6 0 0 0-6 6v8a6 6 0 0 0 12 0V8a6 6 0 0 0-6-6z"/></svg>` }
];

// Game State
let balance = 100;
let currentBet = 10;
let isSpinning = false;

// DOM Elements
const balanceDisplay = document.getElementById('balance-display');
const betDisplay = document.getElementById('bet-display');
const betInput = document.getElementById('bet-input');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const leverTrigger = document.getElementById('lever-trigger');
const leverArm = document.getElementById('lever-arm');

// Bet Buttons
const betMinus = document.getElementById('bet-minus');
const betPlus = document.getElementById('bet-plus');
const chipBtns = document.querySelectorAll('.chip-btn');

function getRandomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function updateBet(newBet) {
  if (isSpinning) return;
  currentBet = Math.max(1, Math.min(newBet, balance));
  betInput.value = currentBet;
  betDisplay.textContent = `$${currentBet}`;
}

betMinus.addEventListener('click', () => updateBet(currentBet - 5));
betPlus.addEventListener('click', () => updateBet(currentBet + 5));
chipBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    updateBet(parseInt(e.target.dataset.bet));
  });
});

function spin() {
  if (isSpinning) return;

  if (balance <= 0 || currentBet > balance) {
    message.textContent = "NO FUEL! REFUEL SYSTEM.";
    resetBtn.classList.remove('hidden');
    return;
  }

  isSpinning = true;
  balance -= currentBet;
  balanceDisplay.textContent = `$${balance}`;
  message.textContent = "WARP DRIVE ACTIVE...";

  leverArm.classList.add('lever-pulled');
  setTimeout(() => leverArm.classList.remove('lever-pulled'), 250);

  reel1.classList.add('spinning');
  reel2.classList.add('spinning');
  reel3.classList.add('spinning');

  let res1, res2, res3;

  setTimeout(() => {
    res1 = getRandomSymbol();
    reel1.innerHTML = res1.svg;
    reel1.classList.remove('spinning');
  }, 400);

  setTimeout(() => {
    res2 = getRandomSymbol();
    reel2.innerHTML = res2.svg;
    reel2.classList.remove('spinning');
  }, 800);

  setTimeout(() => {
    res3 = getRandomSymbol();
    reel3.innerHTML = res3.svg;
    reel3.classList.remove('spinning');

    evaluateResult(res1.name, res2.name, res3.name);
    isSpinning = false;
  }, 1200);
}

function evaluateResult(r1, r2, r3) {
  if (r1 === r2 && r2 === r3) {
    const winnings = currentBet * 10;
    balance += winnings;
    message.textContent = `SUPERNOVA! +$${winnings}`;
  } else if (r1 === r2 || r1 === r3 || r2 === r3) {
    const winnings = Math.floor(currentBet * 2);
    balance += winnings;
    message.textContent = `MATCH FOUND! +$${winnings}`;
  } else {
    message.textContent = "SYSTEM FAILURE. RETRY!";
  }

  balanceDisplay.textContent = `$${balance}`;

  if (balance < currentBet || balance === 0) {
    message.textContent = balance === 0 ? "OUT OF FUEL!" : "INSUFFICIENT CREDITS!";
    resetBtn.classList.remove('hidden');
  }
}

resetBtn.addEventListener('click', () => {
  balance = 100;
  currentBet = 10;
  updateBet(10);
  balanceDisplay.textContent = `$${balance}`;
  message.textContent = "SYSTEM READY.";
  resetBtn.classList.add('hidden');
});

leverTrigger.addEventListener('click', spin);