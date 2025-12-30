import { createHostEngine } from "./hostEngine.js";

const statusEl = document.getElementById("status");
const backBtn = document.getElementById("backBtn");

const lobbyEl = document.getElementById("lobby");
const gameUIEl = document.getElementById("gameUI");

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

let currentRole = null;
let currentSession = null;

let hostEngine = null;   // host-only
let renderState = null;  // client-only

function setStatus(text) {
  statusEl.textContent = `Status: ${text}`;
}
function setResult(text) {
  resultTextEl.textContent = text || "";
}

function showRoom({ code, role }) {
  roomBox.style.display = "block";
  roomCodeEl.textContent = code;
  roleEl.textContent = role;

  currentRole = role;
  currentSession = code;

  startBtn.style.display = role === "host" ? "inline-block" : "none";
}

function enterGameMode() {
  lobbyEl.style.display = "none";
  gameUIEl.style.display = "block";

  meLabelEl.textContent = currentRole || "?";
  otherLabelEl.textContent = currentRole === "host" ? "client" : "host";

  restartBtn.style.display = currentRole === "host" ? "inline-block" : "none";
  setResult("");
}

// -------- client renderer (ritar från state) ----------
function drawState(state) {
  if (!state) return;

  const tileSize = state.tileSize ?? 20;

  // clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // food
  if (state.food) {
    ctx.fillStyle = "#f5a623";
    ctx.fillRect(state.food.x * tileSize, state.food.y * tileSize, tileSize, tileSize);
  }

  // snakes
  for (let i = 0; i < state.snakes.length; i++) {
    const s = state.snakes[i];
    ctx.fillStyle = s.color || (i === 0 ? "black" : "blue");

    // rita som din Snake.draw (lite padding)
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

// -------- WebSocket ----------
setStatus("Ansluter till server...");
const WS_URL = "ws://127.0.0.1:8080";
const ws = new WebSocket(WS_URL);

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

    if (currentRole === "host") {
      hostEngine?.stopLoop?.();
      hostEngine = createHostEngine({ ctx });
      hostEngine.reset();

      hostEngine.startLoop({
        onTick: (state) => {
          // host skickar state varje tick
          sendGame({ kind: "state", state });

          // visa resultat hos host när game over
          if (state.isGameOver) {
            setStatus("Game over (host) ✅");
            const text =
              state.result?.draw ? "Oavgjort!"
              : state.result?.winner === 1 ? "P1 vinner!"
              : state.result?.winner === 2 ? "P2 vinner!"
              : "";
            setResult(text);
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

    if (currentRole === "host") {
      hostEngine?.stopLoop?.();
      hostEngine = createHostEngine({ ctx });
      hostEngine.reset();

      hostEngine.startLoop({
        onTick: (state) => {
          sendGame({ kind: "state", state });

          if (state.isGameOver) {
            setStatus("Game over (host) ✅");
            const text =
              state.result?.draw ? "Oavgjort!"
              : state.result?.winner === 1 ? "P1 vinner!"
              : state.result?.winner === 2 ? "P2 vinner!"
              : "";
            setResult(text);
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

      if (renderState.isGameOver) {
        setStatus("Game over ✅");
        const text =
          renderState.result?.draw ? "Oavgjort!"
          : renderState.result?.winner === 1 ? "P1 vinner!"
          : renderState.result?.winner === 2 ? "P2 vinner!"
          : "";
        setResult(text);
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

restartBtn.addEventListener("click", () => {
  if (ws.readyState !== WebSocket.OPEN) return setStatus("Inte ansluten till server än...");
  if (currentRole !== "host") return setStatus("Bara host kan starta om.");
  ws.send(JSON.stringify({ type: "restart" }));
});

backBtn.addEventListener("click", () => {
  window.location.href = "../../index.html";
});
