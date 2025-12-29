export class MultiplayerApi {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = new WebSocket("ws://localhost:8080");

    this.socket.onopen = () => {
      console.log("Connected to server");
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("From server:", message);
    };

    this.socket.onclose = () => {
      console.log("Disconnected from server");
    };
  }

  send(data) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify(data));
  }
}
