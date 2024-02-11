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

const settings = {
  canvasWidth: 800,
  canvasHeight: 600,
  playerRadius: 10,
  movementSpeed: 5,
  serverTickRate: 15,
  maxPlayers: 2,
  projectileSpeed: 20,
  projectileRadius: 2,
};

const projectiles = {};
let projectileId = 0;

io.on("connection", (socket) => {
  console.log("a user connected");

  // reject connection if max players reached
  if (Object.keys(players).length >= settings.maxPlayers) {
    socket.disconnect();
    return;
  }

  io.emit("gameStart", settings);

  players[socket.id] = {
    x: 300 * Math.random(),
    y: 300 * Math.random(),
    color: `hsl(${Math.random() * 360}, 50%, 50%)`,
    radius: 10,
    movementSpeed: settings.movementSpeed,
    inputSequenceNumber: 0,
  };

  io.emit("updatePlayers", players);

  socket.on("disconnect", (reason) => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
    console.log("a user disconnected");
  });

  socket.on("keyDown", (data) => {
    const player = players[socket.id];
    player.inputSequenceNumber = data.inputSequenceNumber;

    switch (data.key) {
      case "KeyS":
        if (player.y - player.radius >= settings.canvasHeight) {
          player.y = settings.canvasHeight - player.radius;
        } else {
          player.y += settings.movementSpeed;
        }
        break;
      case "KeyW":
        if (player.y - player.radius <= 0) {
          player.y = 0;
        } else {
          player.y -= settings.movementSpeed;
        }
        break;
      case "KeyA":
        if (player.x - player.radius <= 0) {
          player.x = 0;
        } else {
          player.x -= settings.movementSpeed;
        }
        break;
      case "KeyD":
        if (player.x + player.radius >= settings.canvasWidth) {
          player.x = settings.canvasWidth - player.radius;
        } else {
          player.x += settings.movementSpeed;
        }
        break;
      default:
        return;
    }
  });

  socket.on("shoot", ({ angle, x, y }) => {
    projectileId++;

    const velocity = {
      x: Math.cos(angle) * settings.projectileSpeed,
      y: Math.sin(angle) * settings.projectileSpeed,
    };

    projectiles[projectileId] = {
      x,
      y,
      angle,
      velocity,
      playerId: socket.id,
      color: players[socket.id].color,
      radius: settings.projectileRadius,
    };

    console.log("shoot", projectiles);
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
      projectile.x < 0 ||
      projectile.x > settings.canvasWidth ||
      projectile.y < 0 ||
      projectile.y > settings.canvasHeight
    ) {
      delete projectiles[projectileId];
    }
  }

  io.emit("updateProjectiles", projectiles);
  io.emit("updatePlayers", players);
}, settings.serverTickRate);

server.listen(port, () => {
  console.log(`App listening to port ${port}`);
});
