const playerInputs = [];
let inputSequenceNumber = 0;
const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
}

/**
 * SetInterval
 * sends a sequence number on key press for server reconciliation
 * 
 */
setInterval(()=> {

  const currentPlayer = players.currentPlayer();

  if (!currentPlayer) {
    return;
  }
  
  if (keys.w.pressed) {
    inputSequenceNumber++;
    //currentPlayer.inputSequence.push({ sequenceNumber, dx: 0, dy: -currentPlayer.movementSpeed });
    socket.emit("keyDown", { key: "KeyW", sequenceNumber: inputSequenceNumber });
    currentPlayer.y -= currentPlayer.movementSpeed;
  }
  if (keys.a.pressed) {
    inputSequenceNumber++;
    //currentPlayer.inputSequence.push({ sequenceNumber, dx: -currentPlayer.movementSpeed, dy: 0 });
    socket.emit("keyDown", { key: "KeyA", sequenceNumber: inputSequenceNumber });
    currentPlayer.x -= currentPlayer.movementSpeed;
  }
  if (keys.s.pressed) {
    inputSequenceNumber++;
    //currentPlayer.inputSequence.push({ sequenceNumber, dx: 0, dy: currentPlayer.movementSpeed });
    socket.emit("keyDown", { key: "KeyS", sequenceNumber: inputSequenceNumber });
    currentPlayer.y += currentPlayer.movementSpeed;
  }
  if (keys.d.pressed) {
    inputSequenceNumber++;
    //currentPlayer.inputSequence.push({ sequenceNumber, dx: currentPlayer.movementSpeed, dy: 0 });
    socket.emit("keyDown", { key: "KeyD", sequenceNumber: inputSequenceNumber });
    currentPlayer.x += currentPlayer.movementSpeed;
  }

}, 15)

window.addEventListener(
  "keydown",
  function (event) {
    if (event.defaultPrevented || !players.currentPlayer()) {
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
    if (event.defaultPrevented || !players.currentPlayer()) {
      return; // Do nothing if the event was already processed
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
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
  },
  true
);