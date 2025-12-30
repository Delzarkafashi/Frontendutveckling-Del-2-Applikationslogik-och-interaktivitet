// src/online-multiplayer/hostEngine.js
import { Game } from "../core/Game.js";

const DIR_TO_VEC = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export function createHostEngine({ ctx }) {
  const game = new Game(ctx);

  // Vi vill ha 2 spelare i online-match
  game.setPlayers(2);

  // Viktigt: använd INTE game.start() (den hookar keyboard + RAF).
  // Vi kör vår egen loop.
  game.stop();

  let timer = null;

  function exportState() {
    return {
      cols: game.cols,
      rows: game.rows,
      tileSize: game.tileSize,
      food: { x: game.food.x, y: game.food.y },
      snakes: game.snakes.map((s) => ({
        color: s.color,
        segments: s.segments.map((seg) => ({ x: seg.x, y: seg.y })),
      })),
      scores: [...game.scores],
      isGameOver: game.isGameOver,
      result: game.lastResult,
    };
  }

  function reset() {
    // resetMatch -> setPlayers(playerCount) + spawn food + reset score etc.
    game.resetMatch();
    game.isPaused = false;
    game.isGameOver = false;
  }

  function startLoop({ onTick } = {}) {
    stopLoop();

    timer = setInterval(() => {
      if (game.isGameOver) {
        onTick?.(exportState());
        stopLoop();
        return;
      }

      game.update();
      game._render(); // (privat metod men funkar i JS)

      onTick?.(exportState());
    }, game.tickMs);
  }

  function stopLoop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function setP1Dir(dir) {
    const v = DIR_TO_VEC[dir];
    if (!v) return;
    game.snakes[0]?.setDirection(v.x, v.y);
  }

  function setP2Dir(dir) {
    const v = DIR_TO_VEC[dir];
    if (!v) return;
    game.snakes[1]?.setDirection(v.x, v.y);
  }

  return {
    kind: "core-game",
    reset,
    startLoop,
    stopLoop,
    setP1Dir,
    setP2Dir,
    getState: exportState,
  };
}
