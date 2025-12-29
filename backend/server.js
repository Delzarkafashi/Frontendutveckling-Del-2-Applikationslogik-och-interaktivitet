import { WebSocketServer } from "ws";

const PORT = 8080;

const wss = new WebSocketServer({ port: PORT });

console.log("WebSocket server running on port", PORT);

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.send(JSON.stringify({ type: "connected" }));

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());
    console.log("Received:", message);

    ws.send(
      JSON.stringify({
        type: "echo",
        payload: message,
      })
    );
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
