class Player {
  constructor({ x, y, color, radius, movementSpeed, sequenceNumber }) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.movementSpeed = movementSpeed;
    this.sequenceNumber = sequenceNumber;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
