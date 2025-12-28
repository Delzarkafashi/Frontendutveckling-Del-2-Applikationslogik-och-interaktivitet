export class StartScreen {
  constructor({ onStart }) {
    this.screen = document.getElementById("start-screen");
    this.singleBtn = document.getElementById("start-btn");
    this.multiBtn = document.getElementById("multi-btn");

    this.onStart = onStart;
    this.singleBtn?.addEventListener("click", () => {
      this.screen.style.display = "none";
      this.onStart(1);
    });
    this.multiBtn?.addEventListener("click", () => {
      this.screen.style.display = "none";
      this.onStart(2);
    });
  }
}
