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

const mapSettings = {
  tileRows: 32,
  tileColumns: 32,
  tileWidth: 100,
  tileHeight: 75,
};

const gameMap = Array.from({ length: mapSettings.tileRows }, () =>
  Array.from({ length: mapSettings.tileColumns }, () =>
    Math.floor(Math.random() * 2)
  )
);

const players = {};

const gameSettings = {
  viewPortWidth: 800,
  viewPortHeight: 600,
  serverTickRate: 15,
  maxPlayers: 2,
  map: {
    data: gameMap,
    width: mapSettings.tileColumns * mapSettings.tileWidth,
    height: mapSettings.tileRows * mapSettings.tileHeight,
  },
};

const playerSettings = {
  radius: {
    default: 20,
    minimum: 5,
    maximum: 40,
  },
  speed: {
    default: 5,
    minimum: 0.1,
    maximum: 10,
  },
};

const projectileSettings = {
  speed: 20,
  radius: 2,
  damage: 1,
};

const projectiles = {};

io.on("connection", (socket) => {
  // reject connection if max players reached
  if (Object.keys(players).length >= gameSettings.maxPlayers) {
    socket.disconnect();
    return;
  }

  const { token, playerName } = socket.handshake.query;

  console.log("a user connected", "token:", token, "playerName:", playerName);

  players[socket.id] = {
    x: gameSettings.map.width * Math.random(),
    y: gameSettings.map.height * Math.random(),
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
          player.y += player.movementSpeed;
        }
        break;
      case "KeyW":
        if (player.y - player.radius <= 0) {
          player.y = 0;
        } else {
          player.y -= player.movementSpeed;
        }
        break;
      case "KeyA":
        if (player.x - player.radius <= 0) {
          player.x = 0;
        } else {
          player.x -= player.movementSpeed;
        }
        break;
      case "KeyD":
        if (player.x + player.radius >= gameSettings.canvasWidth) {
          player.x = gameSettings.canvasWidth - player.radius;
        } else {
          player.x += player.movementSpeed;
        }
        break;
      default:
        return;
    }
  });

  let projectileId = 0;
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

    // delete out of bounds projectiles
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
          // player hit
          if (player.radius <= playerSettings.radius.minimum) {
            //player eliminated
            io.emit("playerEliminated", playerId);
          } else {
            delete projectiles[projectileId];

            players[playerId].radius -= projectileSettings.damage;
            players[projectile.ownerId].radius += projectileSettings.damage;

            updateMovementSpeeds({ damping: 2 });

            io.emit("playerHit", players);
          }
        }
      }
    }
  }

  io.emit("updateProjectiles", projectiles);
  io.emit("updatePlayerPositions", players);
}, gameSettings.serverTickRate);

// inverses speed based on radius
const updateMovementSpeeds = ({ damping = 0 }) => {
  for (let playerId in players) {
    const radius = players[playerId].radius;

    const inverseRadius =
      (playerSettings.radius.maximum + playerSettings.radius.minimum - radius) /
      damping;

    if (
      inverseRadius >= playerSettings.speed.minimum &&
      inverseRadius <= playerSettings.speed.maximum
    ) {
      players[playerId].movementSpeed = inverseRadius;
    }
  }
};

server.listen(port, () => {
  console.log(`App listening to port ${port}`);
});
