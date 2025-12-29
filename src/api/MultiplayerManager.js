import { MultiplayerApi } from "./MultiplayerApi.js";

export class MultiplayerManager {
  constructor() {
    this.api = new MultiplayerApi();
  }

  start() {
    this.api.connect();

    setTimeout(() => {
      this.api.send({ type: "ping", time: Date.now() });
    }, 1000);
  }
}
