import { Game } from "./src/core/Game.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 50 * 20;
canvas.height = 20 * 20;

const game = new Game(ctx);
game.start();

