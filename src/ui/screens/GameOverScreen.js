export class GameOverScreen {
  constructor({ onRestart }) {
    this.screen = document.getElementById("gameover-screen");
    this.resultEl = document.getElementById("gameover-result");
    this.restartBtn = document.getElementById("restart-btn");

    this.onRestart = onRestart;

    if (this.restartBtn) {
      this.restartBtn.addEventListener("click", () => {
        this.hide();
        if (typeof this.onRestart === "function") this.onRestart();
      });
    }
  }

  show(message = "Game Over") {
    if (this.resultEl) this.resultEl.textContent = message;
    if (this.screen) this.screen.style.display = "grid";
  }

  hide() {
    if (this.screen) this.screen.style.display = "none";
  }
}
