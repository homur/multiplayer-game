class PlayerHandler {
  constructor() {
    this.frontendPlayers = {};
    this.inputSequence = [];
    this.projectiles = [];
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
          playerId: playerId,
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
    this.updateSelfPosition(
      backendPlayers[socket.id].x,
      backendPlayers[socket.id].y,
      backendPlayers[socket.id].sequenceNumber
    );
    this.updateOtherPlayersPositions(backendPlayers);
  }

  updateSelfPosition(x, y, sequenceNumber) {
    const currentPlayer = this.currentPlayer();
    currentPlayer.x = x;
    currentPlayer.y = y;
    currentPlayer.sequenceNumber = sequenceNumber;
  }

  // WIP
  updateOtherPlayersPositions(backendPlayers) {
    for (let playerId in backendPlayers) {
      if (playerId !== socket.id) {
        const frontendPlayer = this.frontendPlayers[playerId];

        if (frontendPlayer) {
          gsap.to(frontendPlayer, {
            duration: 0.1,
            x: backendPlayers[playerId].x,
            y: backendPlayers[playerId].y,
            ease: "linear",
          });
        }
      }
    }
  }

  // lag compensation
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
        currentPlayer.x += input.x;
        currentPlayer.y += input.y;
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

  getProjectiles() {
    return this.projectiles;
  }

  deleteProjectile(projectile) {
    const index = this.projectiles.indexOf(projectile);
    this.projectiles.splice(index, 1);
  }
}

let playerHandler = new PlayerHandler();

socket.on("updatePlayers", (players) => {
  playerHandler.update(players);
});
