const GameState = Object.freeze({
  waiting: 0,
  running: 1,
  ended: 2,
});

let socket;

class GameHandler {
  constructor() {
    this.settings = {};
    this.state = GameState.waiting;
  }

  startGame(settings) {
    document.getElementById("gameStartUi").style.display = "none";
    this.settings = settings;
    this.state = GameState.running;
  }

  initSocket(playerName) {
    socket = io("ws://localhost:3000", { query: { token: "asd", playerName } });
    socket.on("gameStart", ({ settings, players }) => {
      gameHandler.startGame(settings);
      playerHandler.updatePlayerCount(players);
    });
  }

  checkRunning() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.state === GameState.running) {
          resolve(true);
          clearInterval(interval);
        }
      }, 100);
    });
  }

  async isGameRunning() {
    return await this.checkRunning();
  }
}

let gameHandler = new GameHandler();
