const socket = io();

class PlayerHandler {
  constructor() {
    this.frontendPlayers = {};
    this.inputSequence = [];
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
          sequenceNumber: backendPlayer.sequenceNumber,
        });
      }
    }

    // delete players that are not in the backend
    for (let playerId in this.frontendPlayers) {
      if (!backendPlayers[playerId]) {
        delete this.frontendPlayers[playerId];
      }
    }

    this.updatePlayerPositions(backendPlayers);
    this.updateInputSequence()
  }

  updatePlayerPositions(backendPlayers) {
    for (let playerId in this.frontendPlayers) {
      const player = this.frontendPlayers[playerId];

      if (player && backendPlayers[playerId]) {
        player.x = backendPlayers[playerId].x;
        player.y = backendPlayers[playerId].y;
        player.sequenceNumber = backendPlayers[playerId].sequenceNumber;
      }
    }
  }

  updateInputSequence() {
    //this.inputSequence.push({ test: "test" });
    console.log(this.inputSequence)
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
  console.log(playerInputs);
});
