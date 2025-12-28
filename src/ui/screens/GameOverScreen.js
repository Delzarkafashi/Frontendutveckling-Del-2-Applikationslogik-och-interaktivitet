export class GameOverScreen {
  constructor({ onRestart }) {
    this.screen = document.getElementById("gameover-screen");
    this.resultEl = document.getElementById("gameover-result");
    this.restartBtn = document.getElementById("restart-btn");

    this.nameInput = document.getElementById("player-name");

    this.onRestart = onRestart;

    this.restartBtn.addEventListener("click", () => {
      const name = (this.nameInput?.value || "").trim() || "Player";
      this.hide();
      if (typeof this.onRestart === "function") {
        this.onRestart(name);
      }
    });
  }

  show(message = "Game Over") {
    if (this.resultEl) this.resultEl.textContent = message;
    if (this.nameInput) this.nameInput.value = "";
    if (this.screen) this.screen.style.display = "grid";
  }

  hide() {
    if (this.screen) this.screen.style.display = "none";
  }
}
