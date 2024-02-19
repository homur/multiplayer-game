const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 });

const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const players = {};



const gameSettings = {
  canvasWidth: 800,
  canvasHeight: 600,
  serverTickRate: 15,
  maxPlayers: 2,
}

const playerSettings = {
  radius: {
    default: 20,
    minimum: 2,
    maximum: 40,
  },
  speed: {
    default: 5,
    minimum: 1,
    maximum: 10,
  }
}

const projectileSettings = {
  speed: 20,
  radius: 2,
  damage: 1,
}

const projectiles = {};
let projectileId = 0;

io.on("connection", (socket) => {
  // reject connection if max players reached
  if (Object.keys(players).length >= gameSettings.maxPlayers) {
    socket.disconnect();
    return;
  }

  const { token, playerName } = socket.handshake.query;

  console.log("a user connected", "token:", token, "playerName:", playerName);

  players[socket.id] = {
    x: 300 * Math.random(),
    y: 300 * Math.random(),
    color: `hsl(${Math.random() * 360}, 50%, 50%)`,
    radius: playerSettings.radius.default,
    movementSpeed: playerSettings.speed.default,
    inputSequenceNumber: 0,
    playerName: playerName || "",
  };

  io.emit("gameStart", { gameSettings, players });

  socket.on("disconnect", (reason) => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
    console.log("a user disconnected", reason);
  });

  socket.on("keyDown", (data) => {
    const player = players[socket.id];
    player.inputSequenceNumber = data.inputSequenceNumber;

    switch (data.key) {
      case "KeyS":
        if (player.y - player.radius >= gameSettings.canvasHeight) {
          player.y = gameSettings.canvasHeight - player.radius;
        } else {
          player.y += playerSettings.speed.default;
        }
        break;
      case "KeyW":
        if (player.y - player.radius <= 0) {
          player.y = 0;
        } else {
          player.y -= playerSettings.speed.default;
        }
        break;
      case "KeyA":
        if (player.x - player.radius <= 0) {
          player.x = 0;
        } else {
          player.x -= playerSettings.speed.default;
        }
        break;
      case "KeyD":
        if (player.x + player.radius >= settings.canvasWidth) {
          player.x = settings.canvasWidth - player.radius;
        } else {
          player.x += playerSettings.speed.default;
        }
        break;
      default:
        return;
    }
  });

  socket.on("shoot", ({ angle, x, y }) => {
    projectileId++;

    const velocity = {
      x: Math.cos(angle) * projectileSettings.speed,
      y: Math.sin(angle) * projectileSettings.speed,
    };

    projectiles[projectileId] = {
      x,
      y,
      angle,
      velocity,
      ownerId: socket.id,
      color: players[socket.id].color,
      radius: projectileSettings.radius,
    };

    //console.log("shoot", projectiles);
  });
});

// serverTick
setInterval(() => {
  // update projectile positions
  for (let projectileId in projectiles) {
    const projectile = projectiles[projectileId];
    projectile.x += projectile.velocity.x;
    projectile.y += projectile.velocity.y;

    if (
      projectile.x - projectileSettings.radius < 0 ||
      projectile.x + projectileSettings.radius > gameSettings.canvasWidth ||
      projectile.y - projectileSettings.radius < 0 ||
      projectile.y + projectileSettings.radius > gameSettings.canvasHeight
    ) {
      delete projectiles[projectileId];
    }
    // detect collision with players
    else {
      for (let playerId in players) {
        const player = players[playerId];
        const dx = player.x - projectile.x;
        const dy = player.y - projectile.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (
          distance < player.radius + projectileSettings.radius &&
          projectile.ownerId !== playerId
        ) {
          players[playerId].radius -= projectileSettings.damage;
          players[projectile.ownerId].radius += projectileSettings.damage;

          delete projectiles[projectileId];

          io.emit("playerHit", players);
        }
      }
    }
  }

  io.emit("updateProjectiles", projectiles);
  io.emit("updatePlayerPositions", players);
}, gameSettings.serverTickRate);

server.listen(port, () => {
  console.log(`App listening to port ${port}`);
});
