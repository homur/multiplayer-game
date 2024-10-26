class Camera {
  constructor() {
    this.cameraOffsetX = 0;
    this.cameraOffsetY = 0;
    this.width = 0;
    this.height = 0;
  }

  drawMap() {
    if (!this.map) return;

    c.clearRect(0, 0, this.width, this.height);
    c.save();
    c.translate(-this.cameraOffsetX, -this.cameraOffsetY);
    c.fillStyle = "gray";
    c.fillRect(
      playerHandler.currentPlayer.x,
      playerHandler.currentPlayer.y,
      this.width,
      this.height
    );
    c.restore();
  }

  moveMapToPosition({ x, y }) {
    this.cameraOffsetX = x - this.width / 2;
    this.cameraOffsetY = y - this.height / 2;
  }
}

let camera = new Camera();

gameHandler.isGameRunning().then(() => {
  camera.width = gameHandler.settings.viewPortWidth;
  camera.height = gameHandler.settings.viewPortHeight;
});
