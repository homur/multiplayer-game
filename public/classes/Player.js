class Player {
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
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillText("this.playerName", this.x, this.y - this.radius);
    c.fillStyle = this.color;
    c.fill();
  }
}
