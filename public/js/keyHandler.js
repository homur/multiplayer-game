window.addEventListener(
  "keydown",
  function (event) {
    if (event.defaultPrevented || !players.currentPlayer()) {
      return; // Do nothing if the event was already processed
    }

    let currentPlayer = players.currentPlayer();

    switch (event.code) {
      case "KeyS":
        socket.emit("keyDown", { key: "KeyS" });
        currentPlayer.y += currentPlayer.movementSpeed;
        break;
      case "KeyW":
        socket.emit("keyDown", { key: "KeyW" });
        currentPlayer.y -= currentPlayer.movementSpeed;
        break;
      case "KeyA":
        socket.emit("keyDown", { key: "KeyA" });
        currentPlayer.x -= currentPlayer.movementSpeed;
        break;
      case "KeyD":
        socket.emit("keyDown", { key: "KeyD" });
        currentPlayer.x += currentPlayer.movementSpeed;
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  },
  true
);
