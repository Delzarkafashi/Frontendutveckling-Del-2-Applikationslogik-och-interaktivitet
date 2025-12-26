import { Board } from "./Board.js";
import { Snake } from "./Snake.js";
import { Food } from "./Food.js";

export class Game {
  constructor(ctx) {
    this.ctx = ctx;

    this.tileSize = 20;
    this.cols = 50;
    this.rows = 20;

    this.board = new Board(this.cols, this.rows, this.tileSize, this.ctx);

    this.snake = new Snake("black");
    this.food = new Food(this.cols, this.rows, this.tileSize, this.ctx);
    this.food.randomize(this.snake.segments);

    this.isGameOver = false;

    this.score = 0;

    this.onScoreChange = null;

    this.loopId = null;
    this._handleKeyDown = this._handleKeyDown.bind(this);

    this.onGameOver = null;
  }

  start() {
    this.stop();
    this.isGameOver = false;

    this.score = 0;

    if (typeof this.onScoreChange === "function") {
      this.onScoreChange(this.score);
    }

    if (this.gameOverEl) {
      this.gameOverEl.style.display = "none";
    }

    window.addEventListener("keydown", this._handleKeyDown);
    this.loopId = setInterval(() => this.update(), 200);
  }

  stop() {
    if (this.loopId) clearInterval(this.loopId);
    this.loopId = null;
    window.removeEventListener("keydown", this._handleKeyDown);
  }

  update() {
    if (this.isGameOver) return;

    this.snake.update();

    const head = this.snake.segments[0];

    if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
      return this._setGameOver();
    }

    if (this.snake.hasSelfCollision()) {
      return this._setGameOver();
    }

    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.grow();
      this.score += 1;

      if (typeof this.onScoreChange === "function") {
        this.onScoreChange(this.score);
      }

      this.food.randomize(this.snake.segments);
    }

    this.board.clear();
    this.board.drawGrid();
    this.food.draw();
    this.snake.draw(this.ctx, this.tileSize);
  }

  _setGameOver() {
    this.isGameOver = true;
    this.stop();

    if (typeof this.onGameOver === "function") {
      this.onGameOver({ score: this.score });
    }
  }

  _handleKeyDown(event) {
    switch (event.key) {
      case "ArrowUp":
        this.snake.setDirection(0, -1);
        break;
      case "ArrowDown":
        this.snake.setDirection(0, 1);
        break;
      case "ArrowLeft":
        this.snake.setDirection(-1, 0);
        break;
      case "ArrowRight":
        this.snake.setDirection(1, 0);
        break;
    }
  }

  reset() {
    this.isGameOver = false;

    this.snake.segments = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    this.snake.direction = { x: 1, y: 0 };
    this.snake.nextDirection = { x: 1, y: 0 };

    this.food.randomize(this.snake.segments);
  }
}
