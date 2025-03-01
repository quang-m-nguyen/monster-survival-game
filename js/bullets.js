/**
 * Bullets module for the Retro Side Scroller game
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
  },

  // Initialize bullets
  init: function () {
    this.list = [];
  },

  // Create a new bullet
  create: function () {
    this.list.push({
      x: Player.x + Player.width + Game.cameraOffsetX,
      y: Player.y + Player.height / 2 - this.settings.height / 2,
      width: this.settings.width,
      height: this.settings.height,
      speed: this.settings.speed,
    });
  },

  // Update all bullets
  update: function () {
    for (let i = 0; i < this.list.length; i++) {
      // Move bullets
      this.list[i].x += this.list[i].speed;

      // Remove bullets that are off screen
      if (this.list[i].x - Game.cameraOffsetX > Game.canvas.width) {
        this.list.splice(i, 1);
        i--;
        continue;
      }

      // Check for collision with obstacles
      for (let j = 0; j < Obstacles.list.length; j++) {
        if (
          Game.checkCollision(
            {
              x: this.list[i].x - Game.cameraOffsetX,
              y: this.list[i].y,
              width: this.list[i].width,
              height: this.list[i].height,
            },
            {
              x: Obstacles.list[j].x,
              y: Obstacles.list[j].y - Game.cameraOffsetY,
              width: Obstacles.list[j].width,
              height: Obstacles.list[j].height,
            }
          )
        ) {
          // Remove bullet
          this.list.splice(i, 1);
          i--;

          // Remove obstacle
          Obstacles.list.splice(j, 1);
          j--;

          // Increase score
          Game.score += 2;

          // Generate a new obstacle
          Obstacles.generate();

          break;
        }
      }
    }
  },
};
