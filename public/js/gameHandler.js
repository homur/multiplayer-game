const socket = io();

const gameStates = Object.freeze({
  waiting: 0,
  running: 1,
  ended: 2,
});

class GameHandler {
  constructor(settings) {
    this.settings = settings;
    this.state = gameStates.waiting;
  }

  onGameStart() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        console.log(this.state);

        if (this.state === gameStates.running) {
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
  gameHandler.state = gameStates.running;
});
