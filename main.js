const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

function update() {
  // inget state än
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // rita en ruta så vi ser att render körs
  ctx.fillRect(20, 20, 40, 40);
}

function loop() {
  update();
  render();
}

setInterval(loop, 200);
console.log("Game loop started");
