const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

async function startGame() {
  const result = await gameHandler.onGameStart();

  if (result) {
    canvas.width = gameHandler.settings.canvasWidth;
    canvas.height = gameHandler.settings.canvasHeight;

    animate();
  }
}

startGame();

let animationId;
function animate() {
  animationId = requestAnimationFrame(animate);

  c.fillStyle = "rgba(0, 0, 0, 1)";
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillRect(0, 0, canvas.width, canvas.height);

  // draw players
  const playerList = playerHandler.getPlayers();
  for (let playerId in playerList) {
    const player = playerList[playerId];
    player.draw();
  }

  // draw projectiles
  const projectiles = projectileHandler.getProjectiles();
  for (let id in projectiles) {
    projectiles[id].draw();
  }
}
