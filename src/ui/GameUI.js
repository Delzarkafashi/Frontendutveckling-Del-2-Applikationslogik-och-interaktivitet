import { GameOverScreen } from "./screens/GameOverScreen.js";
import { StartScreen } from "./screens/StartScreen.js";
import { PauseScreen } from "./screens/PauseScreen.js";

export class GameUI {
  constructor(game) {
    this.game = game;

    this.onSubmitScore = null;

    this.startUI = new StartScreen({
      onStart: () => {
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

    this.game.onGameOver = ({ score }) => {
      this.pauseUI.hide();

      if (this.game.isPaused) this.game.togglePause();

      this.gameOverUI.show(`Du dog! Score: ${score}`);
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
