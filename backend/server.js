import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const sessions = new Map(); // sessionId -> Set(ws)
const hosts = new Map();    // sessionId -> hostId

const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();

wss.on("connection", (ws) => {
  ws.id = uid();
  ws.session = null;

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());

    // HOST
    if (msg.type === "host") {
      const sessionId = uid();
      sessions.set(sessionId, new Set([ws]));
      hosts.set(sessionId, ws.id);
      ws.session = sessionId;

      ws.send(JSON.stringify({
        type: "hosted",
        session: sessionId,
        clientId: ws.id,
      }));
    }

    // JOIN
    if (msg.type === "join") {
      const sessionId = String(msg.session).toUpperCase();
      const set = sessions.get(sessionId);

      if (!set) {
        ws.send(JSON.stringify({ type: "error", message: "Room finns inte" }));
        return;
      }

      set.add(ws);
      ws.session = sessionId;

      ws.send(JSON.stringify({
        type: "joined",
        session: sessionId,
        clientId: ws.id,
      }));

      for (const client of set) {
        client.send(JSON.stringify({
          type: "player_joined",
          session: sessionId,
          players: set.size,
        }));
      }
    }

    // START (bara host får starta)
    if (msg.type === "start" && ws.session) {
      const sessionId = ws.session;
      const set = sessions.get(sessionId);
      if (!set) return;

      const hostId = hosts.get(sessionId);
      if (ws.id !== hostId) {
        ws.send(JSON.stringify({ type: "error", message: "Bara host kan starta" }));
        return;
      }

      for (const client of set) {
        client.send(JSON.stringify({ type: "started", session: sessionId }));
      }
    }

    // RESTART (bara host får starta om)
    if (msg.type === "restart" && ws.session) {
      const sessionId = ws.session;
      const set = sessions.get(sessionId);
      if (!set) return;

      const hostId = hosts.get(sessionId);
      if (ws.id !== hostId) {
        ws.send(JSON.stringify({ type: "error", message: "Bara host kan starta om" }));
        return;
      }

      for (const client of set) {
        client.send(JSON.stringify({ type: "restarted", session: sessionId }));
      }
    }

    // GAME RELAY
    if (msg.type === "game" && ws.session) {
      const set = sessions.get(ws.session);
      if (!set) return;

      for (const client of set) {
        if (client !== ws) {
          client.send(JSON.stringify({
            type: "game",
            from: ws.id,
            data: msg.data,
          }));
        }
      }
    }
  });

  ws.on("close", () => {
    if (!ws.session) return;
    const sessionId = ws.session;
    const set = sessions.get(sessionId);
    if (!set) return;

    set.delete(ws);
    if (set.size === 0) {
      sessions.delete(sessionId);
      hosts.delete(sessionId);
    }
  });
});

console.log("WebSocket server running on port 8080");
