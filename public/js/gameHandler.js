const socket = io("ws://localhost:3000");

const GameState = Object.freeze({
  waiting: 0,
  running: 1,
  ended: 2,
});

class GameHandler {
  constructor(settings) {
    this.settings = settings;
    this.state = GameState.waiting;
  }

  onGameStart() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.state === GameState.running) {
          clearInterval(interval);
          resolve(true);
        }
      }, 100);
    });
  }
}

let gameHandler = new GameHandler({});

socket.on("gameStart", (settings) => {
  gameHandler.settings = settings;
  gameHandler.state = GameState.running;
});
