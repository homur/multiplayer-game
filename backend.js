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
  playerRadius: 10,
  movementSpeed: 10,
  serverTickRate: 15,
};

io.on("connection", (socket) => {
  console.log("a user connected");

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
        player.y += settings.movementSpeed;
        break;
      case "KeyW":
        player.y -= settings.movementSpeed;
        break;
      case "KeyA":
        player.x -= settings.movementSpeed;
        break;
      case "KeyD":
        player.x += settings.movementSpeed;
        break;
      default:
        return;
    }
  });
});

// serverTick
setInterval(() => {
  io.emit("updatePlayers", players);
}, settings.serverTickRate);

server.listen(port, () => {
  console.log(`App listening to port ${port}`);
});
