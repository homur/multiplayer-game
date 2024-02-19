let inputSequenceNumber = 0;
const serverTickRate = gameHandler.settings.serverTickRate;

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

/**
 * SetInterval
 * sends a sequence number on key press for server reconciliation
 *
 */

gameHandler.isGameRunning().then(() => {
  setInterval(() => {
    const currentPlayer = playerHandler.currentPlayer();

    if (!currentPlayer) {
      return;
    }

    if (keys.w.pressed) {
      inputSequenceNumber++;
      playerHandler.inputSequence.push({
        inputSequenceNumber,
        dx: 0,
        dy: -currentPlayer.movementSpeed,
      });
      socket.emit("keyDown", {
        key: "KeyW",
        inputSequenceNumber,
      });
      currentPlayer.y -= currentPlayer.movementSpeed;
    }
    if (keys.a.pressed) {
      inputSequenceNumber++;
      playerHandler.inputSequence.push({
        inputSequenceNumber,
        dx: -currentPlayer.movementSpeed,
        dy: 0,
      });
      socket.emit("keyDown", {
        key: "KeyA",
        inputSequenceNumber,
      });
      currentPlayer.x -= currentPlayer.movementSpeed;
    }
    if (keys.s.pressed) {
      inputSequenceNumber++;
      playerHandler.inputSequence.push({
        inputSequenceNumber,
        dx: 0,
        dy: currentPlayer.movementSpeed,
      });
      socket.emit("keyDown", {
        key: "KeyS",
        inputSequenceNumber,
      });
      currentPlayer.y += currentPlayer.movementSpeed;
    }
    if (keys.d.pressed) {
      inputSequenceNumber++;
      playerHandler.inputSequence.push({
        inputSequenceNumber,
        dx: currentPlayer.movementSpeed,
        dy: 0,
      });
      socket.emit("keyDown", {
        key: "KeyD",
        inputSequenceNumber,
      });
      currentPlayer.x += currentPlayer.movementSpeed;
    }
  }, serverTickRate);

  window.addEventListener(
    "keydown",
    (event) => {
      if (event.defaultPrevented || !playerHandler.currentPlayer()) {
        return; // Do nothing if the event was already processed
      }

      switch (event.code) {
        case "KeyW":
          keys.w.pressed = true;
          break;
        case "KeyA":
          keys.a.pressed = true;
          break;
        case "KeyS":
          keys.s.pressed = true;
          break;
        case "KeyD":
          keys.d.pressed = true;
          break;
        default:
          return; // Quit when this doesn't handle the key event.
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    },
    true
  );

  window.addEventListener(
    "keyup",
    function (event) {
      if (event.defaultPrevented || !playerHandler.currentPlayer()) {
        return;
      }

      switch (event.code) {
        case "KeyW":
          keys.w.pressed = false;
          break;
        case "KeyA":
          keys.a.pressed = false;
          break;
        case "KeyS":
          keys.s.pressed = false;
          break;
        case "KeyD":
          keys.d.pressed = false;
          break;
        default:
          return;
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    },
    true
  );

  window.addEventListener("click", (event) => {
    const currentPlayer = playerHandler.currentPlayer();

    // relative to canvas
    const angle = Math.atan2(
      event.clientY - (currentPlayer.y + canvas.getBoundingClientRect().top),
      event.clientX - (currentPlayer.x + canvas.getBoundingClientRect().left)
    );

    socket.emit("shoot", {
      angle: angle,
      x: currentPlayer.x,
      y: currentPlayer.y,
    });

    //console.log(playerHandler.getPlayers());
  });
});

document.getElementById("startGame").addEventListener("click", () => {
  const playerName = document.getElementById("playerName").value;

  if (playerName === "") {
    alert("Please enter a playerName");
    return;
  } else {
    gameHandler.initSocket(playerName.toString());
  }
});

document.getElementById("restartGame").addEventListener("click", () => {
  location.reload();
});
