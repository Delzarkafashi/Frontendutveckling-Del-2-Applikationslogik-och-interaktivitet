import { GameOverScreen } from "./screens/GameOverScreen.js";

export class GameUI {
  constructor(game) {
    this.game = game;

    this.gameOverUI = new GameOverScreen({
      onRestart: () => {
        this.game.reset();
        this.game.start();
      },
    });

    this.game.onGameOver = () => {
      this.gameOverUI.show("Du dog!");
    };
  }
}
