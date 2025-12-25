import { Board } from "./Board.js";
import { Snake } from "./Snake.js";

export class Game {
  constructor(ctx) {
    this.ctx = ctx;

    this.tileSize = 20;
    this.cols = 40;
    this.rows = 20;

    this.board = new Board(this.cols, this.rows, this.tileSize, this.ctx);
    this.snake = new Snake("black");

    this.loopId = null;
    this._handleKeyDown = this._handleKeyDown.bind(this);
  }

  start() {
    this.stop();
    window.addEventListener("keydown", this._handleKeyDown);
    this.loopId = setInterval(() => this.update(), 200);
  }

  stop() {
    if (this.loopId) clearInterval(this.loopId);
    this.loopId = null;
    window.removeEventListener("keydown", this._handleKeyDown);
  }

  update() {
    this.snake.update();

    this.board.clear();
    this.board.drawGrid();
    this.snake.draw(this.ctx, this.tileSize);
  }

  _handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp": this.snake.setDirection(0, -1); break;
      case "ArrowDown": this.snake.setDirection(0, 1); break;
      case "ArrowLeft": this.snake.setDirection(-1, 0); break;
      case "ArrowRight": this.snake.setDirection(1, 0); break;
    }
  }
}
