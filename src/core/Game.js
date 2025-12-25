import { Board } from "./Board.js";

export class Game {
  constructor(ctx) {
    this.ctx = ctx;

    this.tileSize = 20;
    this.cols = 50;
    this.rows = 20;

    this.board = new Board(this.cols, this.rows, this.tileSize, this.ctx);

    this.loopId = null;
  }

  start() {
    this.stop();
    this.loopId = setInterval(() => this.update(), 200);
  }

  stop() {
    if (this.loopId) clearInterval(this.loopId);
    this.loopId = null;
  }

  update() {
    // Lektion 5: endast rendering av spelplan
    this.board.clear();
    this.board.drawGrid();
  }
}
