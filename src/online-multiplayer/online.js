import { createHostEngine } from "./hostEngine.js";
import { Board } from "../core/Board.js";
import { GameOverScreen } from "../ui/screens/GameOverScreen.js";

const statusEl = document.getElementById("status");
const backBtn = document.getElementById("backBtn");

const lobbyEl = document.getElementById("lobby");

const hostBtn = document.getElementById("hostBtn");
const joinBtn = document.getElementById("joinBtn");
const roomInput = document.getElementById("roomInput");

const roomBox = document.getElementById("roomBox");
const roomCodeEl = document.getElementById("roomCode");
const roleEl = document.getElementById("role");
const startBtn = document.getElementById("startBtn");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const meLabelEl = document.getElementById("meLabel");
const otherLabelEl = document.getElementById("otherLabel");
const restartBtn = document.getElementById("restartBtn");
const resultTextEl = document.getElementById("resultText");

const p1ScoreEl = document.getElementById("p1-score");
const p2ScoreEl = document.getElementById("p2-score");

const roleInfoEl = document.getElementById("role-info");
let currentRole = null;
let currentSession = null;

let hostEngine = null;   // host-only
let renderState = null;  // client-only

// Client Board (så grid/utseende matchar host)
let clientBoard = null;

// -------- WebSocket ----------
setStatus("Ansluter till server...");
const WS_URL = "ws://127.0.0.1:8080";
const ws = new WebSocket(WS_URL);

// -------- GameOverScreen (återanvänd din UI) ----------
const gameOverScreen = new GameOverScreen({
  onRestart: () => {
    // bara host kan starta om matchen (server restart)
    if (currentRole === "host" && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "restart" }));
    }
  },
  onBack: () => {
    // tillbaka till online-lobbyn
    lobbyEl.style.display = "block";
    setStatus("Välj Host eller Join");
  },
});

function updateRoleInfo() {
  if (!roleInfoEl || !currentRole) return;

  if (currentRole === "host") {
    roleInfoEl.textContent = "Du: host | Andra: client";
  } else {
    roleInfoEl.textContent = "Du: client | Andra: host";
  }
}


function setStatus(text) {
  statusEl.textContent = `Status: ${text}`;
}

function setResult(text) {
  resultTextEl.textContent = text || "";
}

function updateHudScores(scores) {
  p1ScoreEl.textContent = scores?.[0] ?? 0;
  p2ScoreEl.textContent = scores?.[1] ?? 0;
}

function gameOverMessage(state) {
  const p1 = state?.scores?.[0] ?? 0;
  const p2 = state?.scores?.[1] ?? 0;

  if (state?.result?.draw) return `Oavgjort! (P1: ${p1} – P2: ${p2})`;
  if (state?.result?.winner === 1) return `P1 vinner! (P1: ${p1} – P2: ${p2})`;
  if (state?.result?.winner === 2) return `P2 vinner! (P1: ${p1} – P2: ${p2})`;
  return `Game Over (P1: ${p1} – P2: ${p2})`;
}

//  vem är vinnaren? (host = P1, client = P2)
function amIWinner(state) {
  if (!state?.result) return false;
  if (state.result.winner === 1 && currentRole === "host") return true;
  if (state.result.winner === 2 && currentRole === "client") return true;
  return false;
}

//  styr UI i game over:
// - bara vinnaren får skriva namn
// - bara host får starta om (knappen)
function applyGameOverUI(state) {
  const nameInput = document.getElementById("player-name");
  const restartBtnInModal = document.getElementById("restart-btn");

  if (nameInput) {
    nameInput.style.display = amIWinner(state) ? "block" : "none";
  }

  if (restartBtnInModal) {
    restartBtnInModal.style.display = currentRole === "host" ? "inline-block" : "none";
  }
}

function showRoom({ code, role }) {
  roomBox.style.display = "block";
  roomCodeEl.textContent = code;
  roleEl.textContent = role;

  currentRole = role;
  currentSession = code;
  
  startBtn.style.display = role === "host" ? "inline-block" : "none";
  updateRoleInfo();
}

function enterGameMode() {
  lobbyEl.style.display = "none"; // göm lobby overlay

  //  skydda så den inte kraschar om elementen inte finns
  if (meLabelEl) meLabelEl.textContent = currentRole || "?";
  if (otherLabelEl) otherLabelEl.textContent = currentRole === "host" ? "client" : "host";

  // lobby-restart bara för host
  if (restartBtn) restartBtn.style.display = currentRole === "host" ? "inline-block" : "none";

  setResult("");
}


// -------- client renderer (ritar från state) ----------
function drawState(state) {
  if (!state) return;

  const cols = state.cols ?? 50;
  const rows = state.rows ?? 20;
  const tileSize = state.tileSize ?? 20;

  // matcha exakt samma canvas som hostens Game
  const wantedW = cols * tileSize;
  const wantedH = rows * tileSize;

  if (canvas.width !== wantedW) canvas.width = wantedW;
  if (canvas.height !== wantedH) canvas.height = wantedH;

  // skapa board vid behov (grid matchar host)
  if (!clientBoard || clientBoard.cols !== cols || clientBoard.rows !== rows || clientBoard.tileSize !== tileSize) {
    clientBoard = new Board(cols, rows, tileSize, ctx);
  }

  clientBoard.clear();
  clientBoard.drawGrid();

  // food
  if (state.food) {
    ctx.fillStyle = "#f5a623";
    ctx.fillRect(state.food.x * tileSize, state.food.y * tileSize, tileSize, tileSize);
  }

  // snakes (samma padding-stil som Snake.draw)
  for (let i = 0; i < state.snakes.length; i++) {
    const s = state.snakes[i];
    ctx.fillStyle = s.color || (i === 0 ? "black" : "blue");

    const bodyPad = 4;
    const bodySize = tileSize - bodyPad;
    const headPad = 2;
    const headSize = tileSize - headPad;

    s.segments.forEach((seg, idx) => {
      const pad = idx === 0 ? headPad : bodyPad;
      const size = idx === 0 ? headSize : bodySize;

      ctx.fillRect(
        seg.x * tileSize + pad / 2,
        seg.y * tileSize + pad / 2,
        size,
        size
      );
    });
  }
}

function keyToDir(key) {
  if (key === "ArrowUp") return "UP";
  if (key === "ArrowDown") return "DOWN";
  if (key === "ArrowLeft") return "LEFT";
  if (key === "ArrowRight") return "RIGHT";
  return null;
}

// -------- networking helpers ----------
function sendGame(data) {
  if (ws.readyState !== WebSocket.OPEN) return;
  ws.send(JSON.stringify({ type: "game", data }));
}

window.addEventListener("keydown", (e) => {
  const dir = keyToDir(e.key);
  if (!dir) return;

  // Host styr P1 lokalt (riktig Game)
  if (currentRole === "host" && hostEngine) {
    hostEngine.setP1Dir(dir);
  }

  // Client skickar input till host (P2)
  if (currentRole === "client" && renderState && !renderState.isGameOver) {
    sendGame({ kind: "input", dir });
  }
});

ws.addEventListener("open", () => setStatus("Ansluten till server ✅"));
ws.addEventListener("close", () => setStatus("Server frånkopplad ❌"));
ws.addEventListener("error", () => setStatus("WebSocket-fel ❌"));

ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);

  if (msg.type === "hosted") {
    showRoom({ code: msg.session, role: "host" });
    setStatus("Du hostar. Dela room code.");
  }

  if (msg.type === "joined") {
    showRoom({ code: msg.session, role: "client" });
    setStatus("Du gick med i room ✅");
  }

  if (msg.type === "player_joined") {
    setStatus(`Spelare i room: ${msg.players}`);
  }

  if (msg.type === "started") {
    enterGameMode();
    setStatus("Match startad ✅");
    setResult("");
    updateHudScores([0, 0]);

    // om gameover låg kvar, göm den
    gameOverScreen.hide?.();

    if (currentRole === "host") {
      hostEngine?.stopLoop?.();
      hostEngine = createHostEngine({ ctx });
      hostEngine.reset();

      hostEngine.startLoop({
        onTick: (state) => {
          sendGame({ kind: "state", state });
          updateHudScores(state.scores);

          if (state.isGameOver) {
            setStatus("Game over (host) ✅");
            gameOverScreen.show(gameOverMessage(state));
            applyGameOverUI(state);
          }
        },
      });
    } else {
      renderState = { isGameOver: false };
    }
  }

  if (msg.type === "restarted") {
    enterGameMode();
    setStatus("Match startad ✅");
    setResult("");
    updateHudScores([0, 0]);

    gameOverScreen.hide?.();

    if (currentRole === "host") {
      hostEngine?.stopLoop?.();
      hostEngine = createHostEngine({ ctx });
      hostEngine.reset();

      hostEngine.startLoop({
        onTick: (state) => {
          sendGame({ kind: "state", state });
          updateHudScores(state.scores);

          if (state.isGameOver) {
            setStatus("Game over (host) ✅");
            gameOverScreen.show(gameOverMessage(state));
            applyGameOverUI(state);
          }
        },
      });
    } else {
      renderState = { isGameOver: false };
    }
  }

  // relayade game-meddelanden
  if (msg.type === "game") {
    // host tar emot input från client (P2)
    if (currentRole === "host" && msg.data?.kind === "input") {
      hostEngine?.setP2Dir(msg.data.dir);
    }

    // client tar emot state och renderar
    if (currentRole === "client" && msg.data?.kind === "state") {
      renderState = msg.data.state;

      drawState(renderState);
      updateHudScores(renderState.scores);

      if (renderState.isGameOver) {
        setStatus("Game over ✅");
        gameOverScreen.show(gameOverMessage(renderState));
        applyGameOverUI(renderState);
      } else {
        setStatus("Match igång ✅");
      }
    }
  }

  if (msg.type === "error") {
    setStatus(`Fel: ${msg.message}`);
  }
});

// -------- Lobby actions ----------
hostBtn.addEventListener("click", () => {
  if (ws.readyState !== WebSocket.OPEN) return setStatus("Inte ansluten till server än...");
  ws.send(JSON.stringify({ type: "host" }));
});

joinBtn.addEventListener("click", () => {
  if (ws.readyState !== WebSocket.OPEN) return setStatus("Inte ansluten till server än...");

  const code = roomInput.value.trim().toUpperCase();
  if (!code) return setStatus("Skriv en room code först.");

  ws.send(JSON.stringify({ type: "join", session: code }));
});

startBtn.addEventListener("click", () => {
  if (ws.readyState !== WebSocket.OPEN) return setStatus("Inte ansluten till server än...");
  if (currentRole !== "host") return setStatus("Bara host kan starta.");
  ws.send(JSON.stringify({ type: "start" }));
});

// lobby-restart (valfri)
restartBtn.addEventListener("click", () => {
  if (ws.readyState !== WebSocket.OPEN) return setStatus("Inte ansluten till server än...");
  if (currentRole !== "host") return setStatus("Bara host kan starta om.");
  ws.send(JSON.stringify({ type: "restart" }));
});

backBtn.addEventListener("click", () => {
  window.location.href = "../../index.html";
});
