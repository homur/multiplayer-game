class Camera {
  constructor() {
    // Initialize camera properties
    this.cameraX;
    this.cameraY;
  }

  drawMap() {
    c.fillStyle = "rgba(0, 0, 0, 1)";
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillRect(0, 0, canvas.width, canvas.height);
    // Logic to render a specific part of the map
    // Use this.cameraX and this.cameraY to determine the visible area
  }

  moveMapToPosition({ x, y }) {
    console.log("moveMapToPosition", x, y);
    // Logic to move the map based on user movement
    // Update this.cameraX and this.cameraY accordingly
  }
}

const camera = new Camera();

gameHandler.isGameRunning().then(() => {
  camera.moveMapToPosition({
    x: playerHandler.currentPlayer().x,
    y: playerHandler.currentPlayer().y,
  });
});
