const socket = io();

class PlayerHandler {
  constructor() {
    this.frontendPlayers = {};
  }

  update(backendPlayers) {
    // add players that are not in the frontend
    for (let playerId in backendPlayers) {
      const backendPlayer = backendPlayers[playerId];

      if (!this.frontendPlayers[playerId]) {
        this.frontendPlayers[playerId] = new Player({
          x: backendPlayer.x,
          y: backendPlayer.y,
          color: backendPlayer.color,
          radius: backendPlayer.radius,
          movementSpeed: backendPlayer.movementSpeed,
        });
      }
    }

    // delete players that are not in the backend
    for (let playerId in this.frontendPlayers) {
      if (!backendPlayers[playerId]) {
        delete this.frontendPlayers[playerId];
      }
    }

    // update players positions
    this.updatePlayerPositions(backendPlayers);
  }

  updatePlayerPositions(backendPlayers) {
    for (let playerId in this.frontendPlayers) {
      const player = this.frontendPlayers[playerId];

      if (player && backendPlayers[playerId]) {
        player.x = backendPlayers[playerId].x;
        player.y = backendPlayers[playerId].y;
      }
    }
  }

  currentPlayer() {
    return this.frontendPlayers[socket.id];
  }

  getPlayers() {
    return this.frontendPlayers;
  }
}

let players = new PlayerHandler();

socket.on("updatePlayers", (data) => {
  players.update(data);
});
