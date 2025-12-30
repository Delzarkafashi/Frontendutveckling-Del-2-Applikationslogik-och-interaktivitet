export class OnlineSnakeGame {
  constructor({ ctx, cols = 50, rows = 20, tileSize = 20, tickMs = 120 }) {
    this.ctx = ctx;
    this.cols = cols;
    this.rows = rows;
    this.tileSize = tileSize;
    this.tickMs = tickMs;

    this.state = null; // host-state
    this._timer = null;
  }

  // --------- Public API ----------
  reset() {
    const s1 = this._makeSnake(10, 10, "RIGHT");
    const s2 = this._makeSnake(35, 10, "LEFT");

    this.state = {
      running: true,
      gameOver: false,
      resultText: "",
      snakes: [s1, s2],
      food: null,
    };

    this.state.food = this._randomFreeFood(this.state.snakes);
  }

  startLoop({ onTick } = {}) {
    if (!this.state) this.reset();

    this.stopLoop();
    this._timer = setInterval(() => {
      if (!this.state?.running) return;

      this._tick();

      // render hos host
      this.render(this.state);

      // callback så host kan broadcasta state
      onTick?.(this.state);
    }, this.tickMs);
  }

  stopLoop() {
    if (this._timer) clearInterval(this._timer);
    this._timer = null;
  }

  // Host styr P1 lokalt
  setP1Dir(dir) {
    if (!this.state?.running) return;
    this._setNextDir(this.state.snakes[0], dir);
  }

  // Host tar emot P2 input från client
  setP2Dir(dir) {
    if (!this.state?.running) return;
    this._setNextDir(this.state.snakes[1], dir);
  }

  render(state) {
    if (!state) return;
    this._drawBackground();
    this._drawFood(state.food);
    this._drawSnake(state.snakes[0], "#2d7"); // P1
    this._drawSnake(state.snakes[1], "#d55"); // P2
  }

  // --------- Internal game logic ----------
  _tick() {
    const st = this.state;

    this._stepSnake(st.snakes[0]);
    this._stepSnake(st.snakes[1]);

    if (this._selfCollision(st.snakes[0])) st.snakes[0].alive = false;
    if (this._selfCollision(st.snakes[1])) st.snakes[1].alive = false;

    if (st.snakes[0].alive && this._hitOther(st.snakes[0], st.snakes[1])) st.snakes[0].alive = false;
    if (st.snakes[1].alive && this._hitOther(st.snakes[1], st.snakes[0])) st.snakes[1].alive = false;

    // food
    for (const snake of st.snakes) {
      if (!snake.alive) continue;
      if (this._samePos(snake.body[0], st.food)) {
        snake.grow += 3;
        st.food = this._randomFreeFood(st.snakes);
        break;
      }
    }

    const aliveCount = st.snakes.filter(s => s.alive).length;
    if (aliveCount < 2) {
      st.running = false;
      st.gameOver = true;
      st.resultText = this._computeResultText(st);
    }
  }

  _computeResultText(st) {
    const p1Alive = st.snakes[0].alive;
    const p2Alive = st.snakes[1].alive;
    if (p1Alive && !p2Alive) return "P1 vinner!";
    if (!p1Alive && p2Alive) return "P2 vinner!";
    if (!p1Alive && !p2Alive) return "Oavgjort!";
    return "";
  }

  _makeSnake(startX, startY, dir) {
    return {
      dir,
      nextDir: dir,
      body: [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY },
      ],
      grow: 0,
      alive: true,
    };
  }

  _opposite(a, b) {
    return (
      (a === "UP" && b === "DOWN") ||
      (a === "DOWN" && b === "UP") ||
      (a === "LEFT" && b === "RIGHT") ||
      (a === "RIGHT" && b === "LEFT")
    );
  }

  _setNextDir(snake, dir) {
    if (!snake.alive) return;
    if (!dir) return;
    if (this._opposite(snake.dir, dir)) return;
    snake.nextDir = dir;
  }

  _stepSnake(snake) {
    if (!snake.alive) return;

    snake.dir = snake.nextDir;

    const head = snake.body[0];
    const newHead = { x: head.x, y: head.y };

    if (snake.dir === "UP") newHead.y -= 1;
    if (snake.dir === "DOWN") newHead.y += 1;
    if (snake.dir === "LEFT") newHead.x -= 1;
    if (snake.dir === "RIGHT") newHead.x += 1;

    // wall collision
    if (newHead.x < 0 || newHead.x >= this.cols || newHead.y < 0 || newHead.y >= this.rows) {
      snake.alive = false;
      return;
    }

    snake.body.unshift(newHead);

    if (snake.grow > 0) snake.grow -= 1;
    else snake.body.pop();
  }

  _selfCollision(snake) {
    if (!snake.alive) return false;
    const [head, ...rest] = snake.body;
    return rest.some(seg => this._samePos(seg, head));
  }

  _hitOther(snakeA, snakeB) {
    if (!snakeA.alive) return false;
    const head = snakeA.body[0];
    return snakeB.body.some(seg => this._samePos(seg, head));
  }

  _samePos(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  _randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  _randomFreeFood(snakes) {
    for (let tries = 0; tries < 500; tries++) {
      const pos = { x: this._randInt(0, this.cols - 1), y: this._randInt(0, this.rows - 1) };
      const occupied = snakes.some(s => s.body.some(seg => this._samePos(seg, pos)));
      if (!occupied) return pos;
    }
    return { x: 1, y: 1 };
  }

  // --------- Render helpers ----------
  _drawBackground() {
    this.ctx.clearRect(0, 0, this.cols * this.tileSize, this.rows * this.tileSize);
  }

  _drawFood(food) {
    if (!food) return;
    this.ctx.fillStyle = "#f5a623";
    this.ctx.fillRect(food.x * this.tileSize, food.y * this.tileSize, this.tileSize, this.tileSize);
  }

  _drawSnake(snake, color) {
    if (!snake) return;
    this.ctx.fillStyle = color;
    for (const seg of snake.body) {
      this.ctx.fillRect(seg.x * this.tileSize, seg.y * this.tileSize, this.tileSize, this.tileSize);
    }
  }
}
