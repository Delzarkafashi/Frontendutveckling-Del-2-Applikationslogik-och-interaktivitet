export class MultiplayerApi {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.handlers = [];

    this.ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      this.handlers.forEach((fn) =>
        fn(msg.type, msg.from, msg.clientId, msg.data || msg)
      );
    };
  }

  listen(fn) {
    this.handlers.push(fn);
  }

  host() {
    this.ws.send(JSON.stringify({ type: "host" }));
    return this._once("hosted");
  }

  join(session) {
    this.ws.send(JSON.stringify({ type: "join", session }));
    return this._once("joined");
  }

  game(data) {
    this.ws.send(JSON.stringify({ type: "game", data }));
  }

  _once(type) {
    return new Promise((resolve) => {
      const fn = (t, _f, _c, data) => {
        if (t === type) {
          this.handlers = this.handlers.filter((h) => h !== fn);
          resolve(data);
        }
      };
      this.handlers.push(fn);
    });
  }
}
