/**
 * Obstacles module for the Retro Side Scroller game
 */

const Obstacles = {
  list: [],

  // Obstacle generation settings
  settings: {
    minWidth: 30,
    maxWidth: 50,
    minHeight: 30,
    maxHeight: 80,
    minGap: 300,
    maxGap: 600,
    lastObstacleX: 0,
  },

  // Initialize obstacles
  init: function () {
    this.list = [];
    this.settings.lastObstacleX = Game.canvas.width;

    // Generate initial obstacles
    for (let i = 0; i < 3; i++) {
      this.generate();
    }
  },

  // Generate a new obstacle
  generate: function () {
    const width =
      Math.floor(
        Math.random() * (this.settings.maxWidth - this.settings.minWidth + 1)
      ) + this.settings.minWidth;

    const height =
      Math.floor(
        Math.random() * (this.settings.maxHeight - this.settings.minHeight + 1)
      ) + this.settings.minHeight;

    const y = Game.ground.y - height; // Place on ground

    this.list.push({
      x: this.settings.lastObstacleX,
      y,
      width,
      height,
      passed: false,
    });

    // Set position for next obstacle
    const gap =
      Math.floor(
        Math.random() * (this.settings.maxGap - this.settings.minGap + 1)
      ) + this.settings.minGap;

    this.settings.lastObstacleX += width + gap;
  },

  // Update all obstacles
  update: function () {
    for (let i = 0; i < this.list.length; i++) {
      // Move obstacles if camera moves
      if (Input.keys["ArrowRight"] && Player.x >= Game.canvas.width / 2) {
        // Moving right - obstacles move left
        this.list[i].x -= Player.speed;
      } else if (Input.keys["ArrowLeft"] && Game.cameraOffsetX > 0) {
        // Moving left with camera - obstacles move right
        this.list[i].x += Player.speed;
      }

      // Check for collision with player
      const adjustedObstacle = {
        x: this.list[i].x,
        y: this.list[i].y - Game.cameraOffsetY,
        width: this.list[i].width,
        height: this.list[i].height,
      };

      if (Game.checkCollision(Player, adjustedObstacle)) {
        Game.gameOver = true;
        console.log("Game Over! Score: " + Game.score);
      }

      // Increase score when passing an obstacle
      if (
        !this.list[i].passed &&
        this.list[i].x + this.list[i].width < Player.x
      ) {
        this.list[i].passed = true;
        Game.score++;
      }

      // Remove obstacles that are off screen
      if (this.list[i].x + this.list[i].width < 0) {
        this.list.splice(i, 1);
        i--;

        // Generate a new obstacle
        this.generate();
      }
    }
  },
};
