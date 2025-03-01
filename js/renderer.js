/**
 * Renderer module for the Retro Side Scroller game
 */

const Renderer = {
  // Initialize renderer
  init: function (ctx) {
    this.ctx = ctx;
  },

  // Clear the canvas
  clear: function () {
    this.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
  },

  // Draw everything
  draw: function () {
    this.clear();

    // Draw background (simple repeating pattern)
    this.drawBackground();

    // Draw ground
    this.drawGround();

    // Draw player
    this.drawPlayer();

    // Draw bullets
    this.drawBullets();

    // Draw obstacles
    this.drawObstacles();

    // Draw UI (score, distance)
    this.drawUI();

    // Draw game over screen if needed
    if (Game.gameOver) {
      this.drawGameOver();
    }
  },

  // Draw background with parallax effect
  drawBackground: function () {
    this.ctx.fillStyle = "#333";
    for (let i = 0; i < 2; i++) {
      const bgX = Game.background.x + i * Game.background.width;
      // Draw some background elements
      for (let j = 0; j < 10; j++) {
        const starX = bgX + j * 100;
        if (starX > -10 && starX < Game.canvas.width) {
          this.ctx.fillRect(starX, 100 + j * 40, 5, 5);
        }
      }
    }
  },

  // Draw ground
  drawGround: function () {
    this.ctx.fillStyle = "#3c3";
    this.ctx.fillRect(
      0,
      Game.ground.y - Game.cameraOffsetY,
      Game.canvas.width,
      Game.ground.height
    );
  },

  // Draw player
  drawPlayer: function () {
    this.ctx.fillStyle = Player.jumping ? "#ffa500" : "white";
    this.ctx.fillRect(Player.x, Player.y, Player.width, Player.height);
  },

  // Draw bullets
  drawBullets: function () {
    this.ctx.fillStyle = Bullets.settings.color;
    Bullets.list.forEach((bullet) => {
      this.ctx.fillRect(
        bullet.x - Game.cameraOffsetX,
        bullet.y,
        bullet.width,
        bullet.height
      );
    });
  },

  // Draw obstacles
  drawObstacles: function () {
    this.ctx.fillStyle = "#f55";
    Obstacles.list.forEach((obstacle) => {
      // Only draw obstacles that are on screen
      if (obstacle.x + obstacle.width > 0 && obstacle.x < Game.canvas.width) {
        this.ctx.fillRect(
          obstacle.x,
          obstacle.y - Game.cameraOffsetY,
          obstacle.width,
          obstacle.height
        );
      }
    });
  },

  // Draw UI elements
  drawUI: function () {
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText("Score: " + Game.score, 20, 30);
    this.ctx.fillText("Distance X: " + Math.floor(Game.cameraOffsetX), 20, 60);
    this.ctx.fillText("Distance Y: " + Math.floor(Game.cameraOffsetY), 20, 90);
  },

  // Draw game over screen
  drawGameOver: function () {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "48px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "GAME OVER",
      Game.canvas.width / 2,
      Game.canvas.height / 2
    );

    this.ctx.font = "24px Arial";
    this.ctx.fillText(
      "Score: " + Game.score,
      Game.canvas.width / 2,
      Game.canvas.height / 2 + 50
    );
    this.ctx.fillText(
      "Press R to restart",
      Game.canvas.width / 2,
      Game.canvas.height / 2 + 90
    );
  },
};
