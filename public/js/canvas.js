const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

const x = canvas.width / 2;
const y = canvas.height / 2;

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  playerList = players.getPlayers();
  for (let playerId in playerList) {
    const player = playerList[playerId];
    player.draw();
  }
}

animate();
