/**
 * Enemy class
 * 
 */
class Enemy {
    constructor({x, y, name, health, damage, radius, movementSpeed}) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.radius = radius;
        this.movementSpeed = movementSpeed;
    }

    chase(playerPosition) {
        const dx = playerPosition.x - this.x;
        const dy = playerPosition.y - this.y;
        const angle = Math.atan2(dy, dx);
        this.x += this.movementSpeed * Math.cos(angle);
        this.y += this.movementSpeed * Math.sin(angle);

        this.draw(ctx);
    }


    draw() {
        c.beginPath();
        c.arc(this.x, this.y, 10, 0, Math.PI * 2, false);
        c.fill();
    }
}


class FatBoy extends Enemy {
    constructor() {
        super({
            name: "FatBoy",
            health: 100,
            damage: 10,
            radius: 10,
            movementSpeed: 5,
        });
    }
}



class FastBoy extends Enemy {
    constructor() {
        super({
            name: "FastBoy",
            health: 100,
            damage: 50,
            radius: 5,
            movementSpeed: 15,
        });
    }
}

class BossBoy extends Enemy {
    constructor() {
        super({
            name: "BossBoy",
            health: 100,
            damage: 50,
            radius: 15,
            movementSpeed: 15,
        });
    }
}
