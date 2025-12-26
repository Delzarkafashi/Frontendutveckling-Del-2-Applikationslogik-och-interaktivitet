export class StartScreen {
  constructor({ onStart }) {
    this.screen = document.getElementById("start-screen");
    this.startBtn = document.getElementById("start-btn");

    this.onStart = onStart;

    this.startBtn.addEventListener("click", () => {
      this.screen.style.display = "none";
      this.onStart();
    });
  }
}
