class Player {
  moveBoxWidth = 500;
  moveBoxHeight = 500;

  constructor({
    x,
    y,
    color,
    radius,
    movementSpeed,
    sequenceNumber,
    playerId,
    playerName,
  }) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.movementSpeed = movementSpeed;
    this.sequenceNumber = sequenceNumber;
    this.playerId = playerId;
    this.playerName = playerName;
    this.moveBox = {};
  }

  draw() {
    this.moveBox = {
      x: this.x - this.moveBoxWidth / 2,
      y: this.y - this.moveBoxHeight / 2,
      width: this.moveBoxWidth,
      height: this.moveBoxHeight,
    };

    c.fillStyle = "rgba(12, 255, 255, 0.1)";
    c.fillRect(
      this.moveBox.x,
      this.moveBox.y,
      this.moveBox.width,
      this.moveBox.height
    );

    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.fillText(
      this.playerName,
      this.x - this.playerName.length * 2,
      this.y - this.radius
    );
  }
}
