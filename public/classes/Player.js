class Player {
  constructor({ x, y, color, radius, movementSpeed }) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.movementSpeed = movementSpeed;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}
