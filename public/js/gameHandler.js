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
    this.settings = settings;
    this.state = GameState.running;
  }

  initSocket() {
    socket = io("ws://localhost:3000");

    socket.on("gameStart", (settings) => {
      gameHandler.startGame(settings);
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

let gameHandler = new GameHandler({});
