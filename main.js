import { Game } from "./src/core/Game.js";
import { GameUI } from "./src/ui/GameUI.js";
import { loadScores, saveScore } from "./src/storag/scoreboardStorage.js";
import { renderScoreboard } from "./src/ui/ScoreboardView.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 50 * 20;
canvas.height = 20 * 20;

const game = new Game(ctx);
new GameUI(game);

renderScoreboard(loadScores());

const uiOnGameOver = game.onGameOver;

game.onGameOver = ({ score } = {}) => {
  if (typeof uiOnGameOver === "function") {
    uiOnGameOver();
  }

  const updated = saveScore({
    name: "Player",
    score: typeof score === "number" ? score : 0,
  });

  renderScoreboard(updated);
};

const scoreEl = document.getElementById("score-text");

game.onScoreChange = (score) => {
  if (scoreEl) scoreEl.textContent = `Score: ${score}`;
};


game.start();
