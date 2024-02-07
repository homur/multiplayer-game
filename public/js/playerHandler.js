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

    this.updateInputSequence(backendPlayers[socket.id].inputSequenceNumber);
    this.updatePlayerPositions(backendPlayers);
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

  // server reconciliation, lag compensation
  updateInputSequence(backendSequenceNumber) {
    const latestBackendSequence = this.inputSequence.findIndex((input) => {
      return input.inputSequenceNumber === backendSequenceNumber;
    });

    // lag detected
    if (latestBackendSequence !== -1) {
      this.inputSequence.splice(0, latestBackendSequence + 1);

      // move player to the position of the latest input
      this.inputSequence.forEach((input) => {
        const currentPlayer = this.currentPlayer();
        currentPlayer.x += input.dx;
        currentPlayer.y += input.dy;
      });
    }

    //console.log(this.inputSequence);
  }

  currentPlayer() {
    return this.frontendPlayers[socket.id];
  }

  getPlayers() {
    return this.frontendPlayers;
  }
}

let playerHandler = new PlayerHandler();

socket.on("updatePlayers", (data) => {
  playerHandler.update(data);
});
