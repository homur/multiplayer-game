class ProjectileHandler {
  constructor() {
    this.frontendProjectiles = {};
  }

  updateProjectiles(backendProjectiles) {
    for (let backendProjectileId in backendProjectiles) {
      const backendProjectile = backendProjectiles[backendProjectileId];

      if (!this.frontendProjectiles[backendProjectileId]) {
        this.frontendProjectiles[backendProjectileId] = new Projectile(
          backendProjectile.x,
          backendProjectile.y,
          backendProjectile.radius,
          backendProjectile.color,
          backendProjectileId
        );
      }
    }

    for (let projectileId in this.frontendProjectiles) {
      if (!backendProjectiles[projectileId]) {
        delete this.frontendProjectiles[projectileId];
      }
    }

    this.updateProjectilePosition(backendProjectiles);
  }

  updateProjectilePosition(backendProjectiles) {
    for (let projectileId in backendProjectiles) {
      const backendProjectile = backendProjectiles[projectileId];
      const frontendProjectile = this.frontendProjectiles[projectileId];

      if (frontendProjectile) {
        frontendProjectile.x = backendProjectile.x;
        frontendProjectile.y = backendProjectile.y;
        /* gsap.to(frontendProjectile, {
          duration: 0.1,
          x: backendProjectile.x,
          y: backendProjectile.y,
          ease: "linear",
        }); */
      }
    }
  }

  getProjectiles() {
    return this.frontendProjectiles;
  }
}

const projectileHandler = new ProjectileHandler();

gameHandler.isGameRunning().then(() => {
  socket.on("updateProjectiles", (backendProjectiles) => {
    projectileHandler.updateProjectiles(backendProjectiles);
  });
});
