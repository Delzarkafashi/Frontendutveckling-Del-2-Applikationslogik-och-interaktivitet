import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const sessions = new Map(); // sessionId -> Set(ws)

const uid = () => Math.random().toString(36).slice(2, 8);

wss.on("connection", (ws) => {
  ws.id = uid();
  ws.session = null;

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());

    // HOST
    if (msg.type === "host") {
      const sessionId = uid();
      sessions.set(sessionId, new Set([ws]));
      ws.session = sessionId;

      ws.send(JSON.stringify({
        type: "hosted",
        session: sessionId,
        clientId: ws.id
      }));
    }

    // JOIN
    if (msg.type === "join") {
      const set = sessions.get(msg.session);
      if (!set) return;

      set.add(ws);
      ws.session = msg.session;

      ws.send(JSON.stringify({
        type: "joined",
        session: msg.session,
        clientId: ws.id
      }));
    }

    // GAME DATA
    if (msg.type === "game" && ws.session) {
      const set = sessions.get(ws.session);
      if (!set) return;

      for (const client of set) {
        if (client !== ws) {
          client.send(JSON.stringify({
            type: "game",
            from: ws.id,
            data: msg.data
          }));
        }
      }
    }
  });

  ws.on("close", () => {
    if (!ws.session) return;
    const set = sessions.get(ws.session);
    if (!set) return;

    set.delete(ws);
    if (set.size === 0) sessions.delete(ws.session);
  });
});

console.log("WebSocket server running on port 8080");
