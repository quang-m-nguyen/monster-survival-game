/**
 * Bullets module for the Monster Survival Game
 */

const Bullets = {
  list: [],

  // Bullet settings
  settings: {
    width: 10,
    height: 5,
    speed: 15,
    color: "#ff0",
    cooldown: 15, // Frames between shots
    range: 500, // Maximum bullet travel distance
    damage: 10, // Base damage per bullet
  },

  // Initialize bullets
  init: function () {
    this.list = [];
  },

  // Create a new bullet
  create: function () {
    if (Player.shootCooldown <= 0) {
      // Create a new bullet based on player direction
      let bulletX = Player.x;
      let bulletY = Player.y + Player.height / 2 - this.settings.height / 2;
      let velocityX = 0;
      let velocityY = 0;

      switch (Player.direction) {
        case "right":
          bulletX = Player.x + Player.width;
          velocityX = this.settings.speed;
          break;
        case "left":
          bulletX = Player.x - this.settings.width;
          velocityX = -this.settings.speed;
          break;
        case "up":
          bulletX = Player.x + Player.width / 2 - this.settings.width / 2;
          bulletY = Player.y - this.settings.height;
          velocityY = -this.settings.speed;
          break;
        case "down":
          bulletX = Player.x + Player.width / 2 - this.settings.width / 2;
          bulletY = Player.y + Player.height;
          velocityY = this.settings.speed;
          break;
      }

      this.list.push({
        x: bulletX,
        y: bulletY,
        width: this.settings.width,
        height: this.settings.height,
        velocityX,
        velocityY,
        distance: 0,
      });

      // Set cooldown
      Player.shootCooldown = this.settings.cooldown;
    }
  },

  // Update all bullets
  update: function () {
    if (Game.gamePaused) return;

    for (let i = 0; i < this.list.length; i++) {
      const bullet = this.list[i];

      // Move bullet
      bullet.x += bullet.velocityX;
      bullet.y += bullet.velocityY;

      // Update distance traveled
      bullet.distance += Math.sqrt(
        bullet.velocityX * bullet.velocityX +
          bullet.velocityY * bullet.velocityY
      );

      // Remove bullets that are off screen or exceed range
      if (
        bullet.x < 0 ||
        bullet.x > Game.worldSize.width ||
        bullet.y < 0 ||
        bullet.y > Game.worldSize.height ||
        bullet.distance > this.settings.range
      ) {
        this.list.splice(i, 1);
        i--;
        continue;
      }

      // Check for collision with monsters
      for (let j = 0; j < Monsters.list.length; j++) {
        if (Game.checkCollision(bullet, Monsters.list[j])) {
          // Damage monster
          Monsters.list[j].health -= this.settings.damage;

          // Remove bullet
          this.list.splice(i, 1);
          i--;

          // Remove monster if health <= 0
          if (Monsters.list[j].health <= 0) {
            // Apply life steal if player has it
            Player.handleMonsterKill();

            Monsters.list.splice(j, 1);
            j--;

            // Increase score
            Game.score += 10 * LevelSystem.currentLevel;

            // Handle level progression
            LevelSystem.handleMonsterKill();
          }

          break;
        }
      }
    }
  },

  // Draw all bullets
  draw: function (ctx) {
    ctx.fillStyle = this.settings.color;
    this.list.forEach((bullet) => {
      const screenX = bullet.x - Game.cameraOffsetX;
      const screenY = bullet.y - Game.cameraOffsetY;

      // Only draw bullets that are on screen
      if (
        screenX + bullet.width > 0 &&
        screenX < Game.canvas.width &&
        screenY + bullet.height > 0 &&
        screenY < Game.canvas.height
      ) {
        ctx.fillRect(screenX, screenY, bullet.width, bullet.height);
      }
    });
  },
};
