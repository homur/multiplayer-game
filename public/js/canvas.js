const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
let animationId;

gameHandler.isGameRunning().then(() => {
  canvas.width = gameHandler.settings.viewPortWidth;
  canvas.height = gameHandler.settings.viewPortHeight;
  animate();
});

function animate() {
  animationId = requestAnimationFrame(animate);

  //draw map
  camera.drawMap();

  // draw players
  const playerList = playerHandler.getPlayers();
  for (let playerId in playerList) {
    const player = playerList[playerId];
    //console.log(player.playerName)
    player.draw();
  }

  // draw projectiles
  const projectiles = projectileHandler.getProjectiles();
  for (let id in projectiles) {
    projectiles[id].draw();
  }
}
