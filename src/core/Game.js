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

    this.food = new Food(this.cols, this.rows, this.tileSize, this.ctx);

    this.isGameOver = false;
    this.isPaused = false;

    this.playerCount = 1; 
    this.snakes = []; 
    this.scores = []; 

    this.score = 0;

    this.onScoreChange = null;
    this.onGameOver = null;

    this.tickMs = 200;

    this._accumulator = 0;
    this._lastTime = 0;
    this._rafId = null;

    this._handleKeyDown = this._handleKeyDown.bind(this);

    this.lastResult = null; 
    this.loserIndex = null; 

    this.setPlayers(1);
  }
  setPlayers(count = 1) {
    this.playerCount = count;

    if (count === 2) {
      const p1 = new Snake("black");
      p1.segments = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ];
      p1.direction = { x: 1, y: 0 };
      p1.nextDirection = { x: 1, y: 0 };

      const p2 = new Snake("blue");
      p2.segments = [
        { x: this.cols - 11, y: this.rows - 11 },
        { x: this.cols - 10, y: this.rows - 11 },
        { x: this.cols - 9, y: this.rows - 11 },
      ];
      p2.direction = { x: -1, y: 0 };
      p2.nextDirection = { x: -1, y: 0 };

      this.snakes = [p1, p2];
      this.scores = [0, 0];
    } else {
      const p1 = new Snake("black");
      p1.segments = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
      ];
      p1.direction = { x: 1, y: 0 };
      p1.nextDirection = { x: 1, y: 0 };

      this.snakes = [p1];
      this.scores = [0];
    }

    this.snake = this.snakes[0];

    this.score = this.scores[0];

    this.isGameOver = false;
    this.isPaused = false;

    this.lastResult = null;
    this.loserIndex = null;

    this._spawnFoodSafely();
    this._emitScore();
  }

  start() {
    this.stop();

    this.isGameOver = false;
    this.isPaused = false;

    this.scores = this.scores.map(() => 0);
    this.score = 0;

    this.lastResult = null;
    this.loserIndex = null;

    this._emitScore();

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

    for (const s of this.snakes) s.update();

    for (const s of this.snakes) {
      const head = s.segments[0];

      if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
        const loserIndex = this.snakes.indexOf(s);
        return this._setGameOver(loserIndex);
      }

      if (s.hasSelfCollision()) {
        const loserIndex = this.snakes.indexOf(s);
        return this._setGameOver(loserIndex);
      }
    }

    if (this.playerCount === 2) {
      const h0 = this.snakes[0].segments[0];
      const h1 = this.snakes[1].segments[0];

      if (h0.x === h1.x && h0.y === h1.y) {
        return this._setGameOver(null);
      }

      for (const seg of this.snakes[1].segments) {
        if (seg.x === h0.x && seg.y === h0.y) {
          return this._setGameOver(0);
        }
      }

      for (const seg of this.snakes[0].segments) {
        if (seg.x === h1.x && seg.y === h1.y) {
          return this._setGameOver(1);
        }
      }
    }

    for (let i = 0; i < this.snakes.length; i++) {
      const head = this.snakes[i].segments[0];

      if (head.x === this.food.x && head.y === this.food.y) {
        this.snakes[i].grow();
        this.scores[i] += 1;

        this.score = this.scores[0];
        this._emitScore();

        const ok = this._spawnFoodSafely();
        if (!ok) return this._setGameOver(null);
        break;
      }
    }
  }

  _render() {
    this.board.clear();
    this.board.drawGrid();
    this.food.draw();

    for (const s of this.snakes) {
      s.draw(this.ctx, this.tileSize);
    }
  }

  _setGameOver(loserIndex = null) {
    this.isGameOver = true;
    this.stop();

    this.loserIndex = loserIndex;

    if (this.playerCount === 1) {
      this.lastResult = {
        winner: 1,
        loser: null,
        draw: false,
        scores: [...this.scores],
      };
    } else {
      if (loserIndex === null) {
        this.lastResult = {
          winner: 0,
          loser: null,
          draw: true,
          scores: [...this.scores],
        };
      } else {
        const winner = loserIndex === 0 ? 2 : 1;
        this.lastResult = {
          winner,
          loser: loserIndex + 1, 
          draw: false,
          scores: [...this.scores],
        };
      }
    }

    if (typeof this.onGameOver === "function") {
      this.onGameOver({ score: this.score, result: this.lastResult });
    }
  }

  _handleKeyDown(event) {
    if (this.isPaused) return;

    switch (event.key) {
      case "ArrowUp":
        this.snakes[0].setDirection(0, -1);
        break;
      case "ArrowDown":
        this.snakes[0].setDirection(0, 1);
        break;
      case "ArrowLeft":
        this.snakes[0].setDirection(-1, 0);
        break;
      case "ArrowRight":
        this.snakes[0].setDirection(1, 0);
        break;
    }

    if (this.playerCount === 2) {
      if (event.key === "w" || event.key === "W") this.snakes[1].setDirection(0, -1);
      if (event.key === "s" || event.key === "S") this.snakes[1].setDirection(0, 1);
      if (event.key === "a" || event.key === "A") this.snakes[1].setDirection(-1, 0);
      if (event.key === "d" || event.key === "D") this.snakes[1].setDirection(1, 0);
    }
  }

  _emitScore() {
    if (typeof this.onScoreChange === "function") {
      this.onScoreChange(this.score);
    }
  }

  _allSegments() {
    return this.snakes.flatMap((s) => s.segments);
  }

  _spawnFoodSafely() {
    const blocked = new Set(this._allSegments().map((s) => `${s.x},${s.y}`));
    const freeCount = this.cols * this.rows - blocked.size;

    if (freeCount <= 0) return false;

    for (let i = 0; i < 200; i++) {
      this.food.randomize(this._allSegments());
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

  _getSpawnForPlayer(index) {
    if (index === 0) {
      return {
        segments: [
          { x: 10, y: 10 },
          { x: 9, y: 10 },
          { x: 8, y: 10 },
        ],
        dir: { x: 1, y: 0 },
      };
    }

    return {
      segments: [
        { x: this.cols - 11, y: this.rows - 11 },
        { x: this.cols - 10, y: this.rows - 11 },
        { x: this.cols - 9, y: this.rows - 11 },
      ],
      dir: { x: -1, y: 0 },
    };
  }

  resetPlayer(index) {
    if (this.playerCount !== 2) return;

    const snake = this.snakes[index];
    if (!snake) return;

    const spawn = this._getSpawnForPlayer(index);

    snake.segments = spawn.segments.map((s) => ({ ...s }));
    snake.direction = { ...spawn.dir };
    snake.nextDirection = { ...spawn.dir };

    this.scores[index] = 0;

    this._spawnFoodSafely();

    this.score = this.scores[0];
    this._emitScore();
  }

  resetMatch() {
    this.setPlayers(this.playerCount);
  }

  reset() {
    this.setPlayers(this.playerCount);
  }
}
