import { GameOverScreen } from "./screens/GameOverScreen.js";
import { StartScreen } from "./screens/StartScreen.js";
import { PauseScreen } from "./screens/PauseScreen.js";

export class GameUI {
  constructor(game) {
    this.game = game;

    this.onSubmitScore = null;

    this.startUI = new StartScreen({
      onStart: (players) => {
        this.game.setPlayers(players);
        this.game.reset();
        this.game.start();
      },
    });

    this.gameOverUI = new GameOverScreen({
      onRestart: (name) => {
        if (typeof this.onSubmitScore === "function") {
          this.onSubmitScore(name);
        }

        this.gameOverUI.hide();
        this.game.reset();
        this.game.start();
      },
    });

    this.pauseUI = new PauseScreen({
      onResume: () => {
        this.pauseUI.hide();
        this.game.togglePause();
      },
      onRestart: () => {
        this.pauseUI.hide();

        if (this.game.isPaused) this.game.togglePause();

        this.game.reset();
        this.game.start();
      },
      onQuit: () => {
        this.pauseUI.hide();

        if (this.game.isPaused) this.game.togglePause();

        this.game.stop();
        this.game.reset();

        const startEl = document.getElementById("start-screen");
        if (startEl) startEl.style.display = "grid";
      },
    });

    this.game.onGameOver = ({ score, result } = {}) => {
      this.pauseUI.hide();

      if (this.game.isPaused) this.game.togglePause();

      let message = `Du dog! Score: ${typeof score === "number" ? score : 0}`;

      if (result && this.game.playerCount === 2) {
        if (result.draw) {
          message = `Oavgjort! (P1: ${result.scores?.[0] ?? 0} | P2: ${result.scores?.[1] ?? 0})`;
        } else {
          message = `Vinnare: Spelare ${result.winner} (P1: ${result.scores?.[0] ?? 0} | P2: ${result.scores?.[1] ?? 0})`;
        }
      }

      this.gameOverUI.show(message);
    };

    window.addEventListener("keydown", (e) => {
      const isPauseKey = e.key === "Escape" || e.key === "p" || e.key === "P";
      if (!isPauseKey) return;

      const startEl = document.getElementById("start-screen");
      const startVisible = startEl && startEl.style.display !== "none";
      if (startVisible) return;

      const gameOverEl = document.getElementById("gameover-screen");
      const gameOverVisible = gameOverEl && gameOverEl.style.display !== "none";
      if (gameOverVisible) return;

      if (this.pauseUI.isVisible()) {
        this.pauseUI.hide();
        this.game.togglePause();
      } else {
        this.game.togglePause();
        this.pauseUI.show();
      }
    });
  }
}
