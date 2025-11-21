const difficultyEl = document.getElementById("difficulty");
const guessEl = document.getElementById("guess");
const submitEl = document.getElementById("submit");
const restartEl = document.getElementById("restart");
const attemptsEl = document.getElementById("attempts");
const messageEl = document.getElementById("message");
const bubbleEl = document.getElementById("bubble");
const dinoEl = document.getElementById("dino");
const bonusTryEl = document.getElementById("bonusTry");
const playerNameEl = document.getElementById("playerName");
const saveNameEl = document.getElementById("saveName");
const duckMessageEl = document.getElementById("duckMessage");
const btnStatsModesEl = document.getElementById("btnStatsModes");
const btnStatsWinsEl = document.getElementById("btnStatsWins");
const btnStatsLossesEl = document.getElementById("btnStatsLosses");

const difficulties = {
  facil: { max: 20, tries: 10 },
  normal: { max: 20, tries: 5 },
  dificil: { max: 50, tries: 3 }
};
const modeLabel = { facil: "Fácil", normal: "Normal", dificil: "Difícil" };

let secret = 0;
let triesLeft = 0;
let max = 20;
let bonusUsed = false;
let stats = { modes: { facil: 0, normal: 0, dificil: 0 }, wins: 0, losses: 0, lastMode: "normal" };
function loadStats() {
  const s = localStorage.getItem("palp_stats");
  if (s) stats = JSON.parse(s);
  const nm = localStorage.getItem("palp_name");
  if (nm && playerNameEl) playerNameEl.value = nm;
}
function saveStats() { localStorage.setItem("palp_stats", JSON.stringify(stats)); }
function updateDuckMessage() {
  const nmRaw = localStorage.getItem("palp_name");
  if (!nmRaw || !nmRaw.trim()) {
    duckMessageEl.textContent = "Digite seu nome antes de ver as estatísticas.";
    return;
  }
  const nm = nmRaw.trim();
  duckMessageEl.textContent = `Oiiii ${nm}, voce está no modo ${modeLabel[stats.lastMode] || stats.lastMode}, use as funcionalidade abaixo para acompanhar seu score.`;
}

function rand(n) { return Math.floor(Math.random() * n) + 1; }

function setMessage(text, state) {
  bubbleEl.classList.remove("state-low","state-high","state-correct","state-lost","state-near");
  if (state) bubbleEl.classList.add(state);
  messageEl.innerHTML = text;
}

function updateHud() {
  attemptsEl.textContent = `Tentativas: ${triesLeft}`;
  guessEl.min = 1;
  guessEl.max = max;
}

function beep(freq, dur, type="sine") {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(ctx.destination);
  g.gain.setValueAtTime(0.001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
  o.start();
  o.stop(ctx.currentTime + dur);
}

function startGame() {
  const d = difficulties[difficultyEl.value];
  max = d.max;
  triesLeft = d.tries;
  secret = rand(max);
  bonusUsed = false;
  bonusTryEl.style.display = "none";
  stats.lastMode = difficultyEl.value;
  saveStats();
  updateDuckMessage();
  setMessage(`Comece chutando um número de 1 a ${max}!`, "");
  submitEl.disabled = false;
  guessEl.disabled = false;
  guessEl.value = "";
  updateHud();
}

function closeness(diff) {
  const t = Math.max(2, Math.round(max * 0.1));
  if (diff <= 2) return "Está bem perto!";
  if (diff <= t) return "Está perto!";
  return "Está longe!";
}
function isNear(diff) {
  const t = Math.max(2, Math.round(max * 0.1));
  return diff <= t;
}
function hintRange() {
  const span = Math.max(2, Math.round(max * 0.1));
  const low = Math.max(1, secret - span);
  const high = Math.min(max, secret + span);
  return `Tente um número entre ${low}-${high}`;
}

function finishWin() {
  setMessage(`Você acertou! O número era ${secret}.`, "state-correct");
  submitEl.disabled = true;
  guessEl.disabled = true;
  stats.wins += 1;
  saveStats();
  updateDuckMessage();
  dinoEl.classList.remove("dino-shake");
  dinoEl.classList.add("dino-bounce");
  beep(880, 0.15, "triangle");
  setTimeout(() => beep(1320, 0.12, "triangle"), 160);
}

function finishLose() {
  setMessage(`Você perdeu! O número era ${secret}.`, "state-lost");
  submitEl.disabled = true;
  guessEl.disabled = true;
  stats.losses += 1;
  saveStats();
  updateDuckMessage();
  dinoEl.classList.remove("dino-bounce");
  dinoEl.classList.add("dino-shake");
  beep(220, 0.25, "sawtooth");
}

submitEl.addEventListener("click", () => {
  if (submitEl.disabled) return;
  const val = parseInt(guessEl.value, 10);
  if (Number.isNaN(val) || val < 1 || val > max) {
    setMessage(`Digite um número entre 1 e ${max}.`, "");
    return;
  }
  stats.modes[stats.lastMode] = (stats.modes[stats.lastMode] || 0) + 1;
  saveStats();
  const diff = Math.abs(val - secret);
  if (val === secret) {
    finishWin();
    return;
  }
  triesLeft -= 1;
  if (val < secret) {
    setMessage(`Muito baixo. ${closeness(diff)} (restam ${triesLeft} tentativas)<br>${hintRange()}`, isNear(diff) ? "state-near" : "state-low");
    dinoEl.classList.remove("dino-bounce");
    dinoEl.classList.add("dino-shake");
    beep(440, 0.12, "square");
  } else {
    setMessage(`Muito alto. ${closeness(diff)} (restam ${triesLeft} tentativas)<br>${hintRange()}`, isNear(diff) ? "state-near" : "state-high");
    dinoEl.classList.remove("dino-bounce");
    dinoEl.classList.add("dino-shake");
    beep(340, 0.12, "square");
  }
  updateHud();
  if (triesLeft <= 0) {
    if (difficultyEl.value === "dificil" && !bonusUsed) {
      submitEl.disabled = true;
      setMessage(`Acabaram as tentativas. Você tem direito a mais uma!<br>Clique em "Tentativa extra" para continuar.`, "state-lost");
      bonusTryEl.style.display = "block";
      return;
    }
    finishLose();
  }
});

restartEl.addEventListener("click", startGame);
difficultyEl.addEventListener("change", startGame);
guessEl.addEventListener("keydown", e => { if (e.key === "Enter") submitEl.click(); });
bonusTryEl.addEventListener("click", () => {
  if (bonusUsed) return;
  bonusUsed = true;
  triesLeft = 1;
  bonusTryEl.style.display = "none";
  submitEl.disabled = false;
  setMessage(`Tentativa extra ativada! Faça mais um palpite.`, "state-near");
  updateHud();
});
saveNameEl.addEventListener("click", () => {
  const nm = (playerNameEl.value || "").trim();
  if (nm) localStorage.setItem("palp_name", nm);
  updateDuckMessage();
});
btnStatsModesEl.addEventListener("click", () => {
  duckMessageEl.textContent = `Fácil: ${stats.modes.facil} • Normal: ${stats.modes.normal} • Difícil: ${stats.modes.dificil}`;
});
btnStatsWinsEl.addEventListener("click", () => {
  duckMessageEl.textContent = `Acertos: ${stats.wins}`;
});
btnStatsLossesEl.addEventListener("click", () => {
  duckMessageEl.textContent = `Erros: ${stats.losses}`;
});
loadStats();
updateDuckMessage();

startGame();