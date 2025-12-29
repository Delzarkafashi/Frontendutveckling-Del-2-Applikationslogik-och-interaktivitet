import { MultiplayerApi } from "../api/MultiplayerApi.js";

const api = new MultiplayerApi("ws://localhost:8080");

const hostBtn = document.getElementById("host-btn");
const joinBtn = document.getElementById("join-btn");
const sendBtn = document.getElementById("send-btn");
const sessionInput = document.getElementById("session-id");

api.listen((event, messageId, clientId, data) => {
  console.log("EVENT:", event, messageId, clientId, data);
});

hostBtn.onclick = async () => {
  const res = await api.host();
  sessionInput.value = res.session;
};

joinBtn.onclick = async () => {
  await api.join(sessionInput.value);
};

sendBtn.onclick = () => {
  api.game({ hello: "world", t: Date.now() });
};
