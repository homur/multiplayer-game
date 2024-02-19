class PlayerHandler {
  constructor() {
    this.frontendPlayers = {};
    this.inputSequence = [];
    this.projectiles = [];
  }

  updatePlayerCount(backendPlayers) {
    this.addMissingPlayers(backendPlayers);
    this.deleteGonePlayers(backendPlayers);
  }

  updatePlayerPositions(backendPlayers) {
    this.updateInputSequence(backendPlayers[socket.id].inputSequenceNumber);
    this.updateSelfPosition(backendPlayers[socket.id]);
    this.updateOtherPlayersPositions(backendPlayers);
  }

  // add players that are not in the frontend
  addMissingPlayers(backendPlayers) {
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
          playerName: backendPlayer.playerName,
        });
      }
    }
  }

  // delete players that are not in the backend
  deleteGonePlayers(backendPlayers) {
    for (let playerId in this.frontendPlayers) {
      if (!backendPlayers[playerId]) {
        this.removePlayer(playerId);
      }
    }
  }

  removePlayer(playerId) {
    delete this.frontendPlayers[playerId];
  }

  updateSelfPosition(backendPlayer) {
    const currentPlayer = this.currentPlayer();
    currentPlayer.x = backendPlayer.x;
    currentPlayer.y = backendPlayer.y;
    currentPlayer.sequenceNumber = backendPlayer.sequenceNumber;
  }

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

  updateOnDamage(backendPlayers) {
    for (let playerId in backendPlayers) {
      if (this.frontendPlayers[playerId]) {
        this.frontendPlayers[playerId].radius = backendPlayers[playerId].radius;
        this.frontendPlayers[playerId].movementSpeed =
          backendPlayers[playerId].movementSpeed;
      }
    }
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

  updateDebugUi() {
    const player = this.currentPlayer();

    document.getElementById("pId").innerText = player.playerId;
    document.getElementById("pName").innerText = player.playerName;
    document.getElementById("pX").innerText = player.x;
    document.getElementById("pY").innerText = player.y;
    document.getElementById("pRadius").innerText = player.playerName;
    document.getElementById("pMoveSpeed").innerText = player.movementSpeed;
  }
}

let playerHandler = new PlayerHandler();

gameHandler.isGameRunning().then(() => {
  socket.on("updatePlayers", (players) => {
    playerHandler.updatePlayerCount(players);
  });

  socket.on("updatePlayerPositions", (players) => {
    playerHandler.updatePlayerPositions(players);
    playerHandler.updateDebugUi();
  });

  socket.on("playerHit", (backendPlayers) => {
    playerHandler.updateOnDamage(backendPlayers);
  });

  socket.on("playerEliminated", (playerId) => {
    if (playerId === playerHandler.currentPlayer().playerId) {
      document.getElementById("gameOverUi").style.display = "flex";
      socket.disconnect();
    }
  });
});
