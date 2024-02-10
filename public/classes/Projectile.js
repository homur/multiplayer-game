class Projectile {
  constructor(x, y, radius, color, projectileId) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.projectileId = projectileId;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
}
