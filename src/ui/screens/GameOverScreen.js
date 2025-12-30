export class GameOverScreen {
  constructor({ onRestart, onBack } = {}) {
    this.screen = document.getElementById("gameover-screen");
    this.resultEl = document.getElementById("gameover-result");
    this.restartBtn = document.getElementById("restart-btn");
    this.nameInput = document.getElementById("player-name");

    // valfri (kan finnas i online och/eller vanliga spelet)
    this.backBtn = document.getElementById("gameover-back-btn");

    this.onRestart = onRestart;
    this.onBack = onBack;

    this.restartBtn?.addEventListener("click", () => {
      const name = (this.nameInput?.value || "").trim() || "Player";
      this.hide();
      if (typeof this.onRestart === "function") {
        this.onRestart(name);
      }
    });

    this.backBtn?.addEventListener("click", () => {
      //  1) Om sidan/läget har egen back-logik (t.ex. online)
      if (typeof this.onBack === "function") {
        this.hide();
        this.onBack();
        return;
      }

      //  2) Fallback för vanliga spelet / lokal multiplayer:
      // Gå tillbaka till start-menyn
      this.hide();

      const startScreen = document.getElementById("start-screen");
      if (startScreen) startScreen.style.display = "grid";

      //  städa upp om andra overlays råkar vara öppna
      const pauseScreen = document.getElementById("pause-screen");
      if (pauseScreen) pauseScreen.style.display = "none";
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
