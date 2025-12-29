import { GameOverScreen } from "./screens/GameOverScreen.js";
import { StartScreen } from "./screens/StartScreen.js";
import { PauseScreen } from "./screens/PauseScreen.js";

export class GameUI {
  constructor(game) {
    this.game = game;

    this.onSubmitScore = null;

    this.p1ScoreEl = document.getElementById("p1-score");
    this.p2ScoreEl = document.getElementById("p2-score");
    this.p2BoxEl = document.getElementById("hud-p2");
    this.statusEl = document.getElementById("game-status");
    this.matchResultEl = document.getElementById("match-result");

    this._hudRaf = null;

    this.startUI = new StartScreen({
      onStart: (players) => {
        this._hideMatchResult();
        this.game.setPlayers(players);
        this._syncHudVisibility();
        this._setStatus("Spelar");
        this.game.reset();
        this.game.start();
      },
    });

    this.gameOverUI = new GameOverScreen({
      onRestart: (name) => {
        if (typeof this.onSubmitScore === "function") {
          this.onSubmitScore(name);
        }

        this._hideMatchResult();
        this.gameOverUI.hide();
        this.game.reset();
        this._setStatus("Spelar");
        this.game.start();
      },
    });

    this.pauseUI = new PauseScreen({
      onResume: () => {
        this.pauseUI.hide();
        this.game.togglePause();
        this._setStatus("Spelar");
      },
      onRestart: () => {
        this.pauseUI.hide();

        if (this.game.isPaused) this.game.togglePause();

        this._hideMatchResult();
        this.game.reset();
        this._setStatus("Spelar");
        this.game.start();
      },
      onQuit: () => {
        this.pauseUI.hide();

        if (this.game.isPaused) this.game.togglePause();

        this.game.stop();
        this.game.reset();

        this._hideMatchResult();
        this._setStatus("Redo");

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

      this._setStatus("Game Over");
      this._showMatchResult(result);

      const nameInput = document.getElementById("player-name");
      if (nameInput) {
        nameInput.style.display = this.game.playerCount === 2 ? "none" : "block";
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

      const pauseEl = document.getElementById("pause-screen");
      const pausedVisible = pauseEl && pauseEl.style.display !== "none";

      if (pausedVisible) {
        this.pauseUI.hide();
        this.game.togglePause();
        this._setStatus("Spelar");
      } else {
        this.game.togglePause();
        this.pauseUI.show();
        this._setStatus("Paus");
      }
    });

    this._syncHudVisibility();
    this._setStatus("Redo");
    this._startHudLoop();
  }

  _startHudLoop() {
    const tick = () => {
      this._renderHud();
      this._hudRaf = requestAnimationFrame(tick);
    };
    this._hudRaf = requestAnimationFrame(tick);
  }

  _renderHud() {
    const s0 = this.game.scores?.[0] ?? 0;
    const s1 = this.game.scores?.[1] ?? 0;

    if (this.p1ScoreEl) this.p1ScoreEl.textContent = String(s0);
    if (this.p2ScoreEl) this.p2ScoreEl.textContent = String(s1);

    if (this.game.isGameOver) {
      this._setStatus("Game Over");
      return;
    }

    if (this.game.isPaused) {
      this._setStatus("Paus");
      return;
    }

    const startEl = document.getElementById("start-screen");
    const startVisible = startEl && startEl.style.display !== "none";
    if (startVisible) {
      this._setStatus("Redo");
      return;
    }

    this._setStatus("Spelar");
  }

  _syncHudVisibility() {
    if (this.p2BoxEl) {
      this.p2BoxEl.style.display = this.game.playerCount === 2 ? "grid" : "none";
    }
  }

  _setStatus(text) {
    if (this.statusEl) this.statusEl.textContent = text;
  }

  _showMatchResult(result) {
    if (!this.matchResultEl) return;

    if (!result || this.game.playerCount !== 2) {
      this.matchResultEl.style.display = "none";
      this.matchResultEl.textContent = "";
      return;
    }

    const p1 = result.scores?.[0] ?? 0;
    const p2 = result.scores?.[1] ?? 0;

    if (result.draw) {
      this.matchResultEl.textContent = `Oavgjort (${p1} - ${p2})`;
    } else {
      this.matchResultEl.textContent = `Vinnare: P${result.winner} (${p1} - ${p2})`;
    }

    this.matchResultEl.style.display = "block";
  }

  _hideMatchResult() {
    if (!this.matchResultEl) return;
    this.matchResultEl.style.display = "none";
    this.matchResultEl.textContent = "";
  }
}
