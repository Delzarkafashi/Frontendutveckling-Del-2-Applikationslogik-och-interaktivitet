export class PauseScreen {
  constructor({ onResume, onRestart, onQuit }) {
    this.screen = document.getElementById("pause-screen");
    this.resumeBtn = document.getElementById("resume-btn");
    this.restartBtn = document.getElementById("pause-restart-btn");
    this.quitBtn = document.getElementById("quit-btn");

    this.onResume = onResume;
    this.onRestart = onRestart;
    this.onQuit = onQuit;

    this.resumeBtn?.addEventListener("click", () => {
      this.hide();
      if (typeof this.onResume === "function") this.onResume();
    });

    this.restartBtn?.addEventListener("click", () => {
      this.hide();
      if (typeof this.onRestart === "function") this.onRestart();
    });

    this.quitBtn?.addEventListener("click", () => {
      this.hide();
      if (typeof this.onQuit === "function") this.onQuit();
    });
  }

  show() {
    if (this.screen) this.screen.style.display = "grid";
  }

  hide() {
    if (this.screen) this.screen.style.display = "none";
  }

  isVisible() {
    return this.screen && this.screen.style.display !== "none";
  }
}
