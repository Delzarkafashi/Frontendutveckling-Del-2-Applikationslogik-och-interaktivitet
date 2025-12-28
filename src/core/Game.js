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

    this.isGameOver = false;
    this.isPaused = false;

    this.score = 0;
    this.onScoreChange = null;
    this.onGameOver = null;

    this.tickMs = 200;

    this._accumulator = 0;
    this._lastTime = 0;
    this._rafId = null;

    this._handleKeyDown = this._handleKeyDown.bind(this);

    this._spawnFoodSafely();
  }

  start() {
    this.stop();

    this.isGameOver = false;
    this.isPaused = false;

    this.score = 0;
    if (typeof this.onScoreChange === "function") {
      this.onScoreChange(this.score);
    }

    window.addEventListener("keydown", this._handleKeyDown);

    this._lastTime = performance.now();
    this._accumulator = 0;
    this._rafId = requestAnimationFrame((t) => this._loop(t));
  }

  stop() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;

    window.removeEventListener("keydown", this._handleKeyDown);
  }

  togglePause() {
    if (this.isGameOver) return;

    this.isPaused = !this.isPaused;

    if (!this.isPaused) {
      this._lastTime = performance.now();
      this._accumulator = 0;
    }
  }

  _loop(time) {
    if (this.isGameOver) return;

    const dt = time - this._lastTime;
    this._lastTime = time;

    if (!this.isPaused) {
      this._accumulator += dt;

      while (this._accumulator >= this.tickMs) {
        this.update();
        this._accumulator -= this.tickMs;

        if (this.isGameOver) break;
      }
    }

    this._render();

    this._rafId = requestAnimationFrame((t) => this._loop(t));
  }

  update() {
    if (this.isGameOver || this.isPaused) return;

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

      const ok = this._spawnFoodSafely();
      if (!ok) {
        return this._setGameOver();
      }
    }
  }

  _render() {
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
    if (this.isPaused) return;

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


  _spawnFoodSafely() {
    const blocked = new Set(this.snake.segments.map((s) => `${s.x},${s.y}`));
    const freeCount = this.cols * this.rows - blocked.size;

    if (freeCount <= 0) return false;

    for (let i = 0; i < 200; i++) {
      this.food.randomize(this.snake.segments);
      const key = `${this.food.x},${this.food.y}`;
      if (!blocked.has(key)) return true;
    }

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const key = `${x},${y}`;
        if (!blocked.has(key)) {
          this.food.x = x;
          this.food.y = y;
          return true;
        }
      }
    }

    return false;
  }

  reset() {
    this.isGameOver = false;
    this.isPaused = false;

    this.score = 0;
    if (typeof this.onScoreChange === "function") {
      this.onScoreChange(this.score);
    }

    this.snake.segments = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    this.snake.direction = { x: 1, y: 0 };
    this.snake.nextDirection = { x: 1, y: 0 };

    this._spawnFoodSafely();
  }
}
