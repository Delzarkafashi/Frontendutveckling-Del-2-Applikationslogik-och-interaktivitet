import { GameOverScreen } from "./screens/GameOverScreen.js";
import { StartScreen } from "./screens/StartScreen.js";

export class GameUI {
  constructor(game) {
    this.game = game;

    this.startUI = new StartScreen({
      onStart: () => {
        this.game.start();
      },
    });

    this.gameOverUI = new GameOverScreen({
      onRestart: () => {
        this.gameOverUI.hide();
        this.game.reset();
        this.game.start();
      },
    });

    this.game.onGameOver = ({ score }) => {
      this.gameOverUI.show(`Du dog! Score: ${score}`);
    };
  }
}
