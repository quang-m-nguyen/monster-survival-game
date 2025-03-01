/**
 * Renderer module for the Monster Survival Game
 * Handles all drawing operations for the game
 */
const Renderer = {
  canvas: null,
  ctx: null,
  cameraOffsetX: 0,
  cameraOffsetY: 0,
  worldSize: { width: 0, height: 0 },

  /**
   * Initialize the renderer
   * @param {HTMLCanvasElement} canvas - The game canvas
   * @param {Object} worldSize - The size of the game world
   */
  init: function (canvas, worldSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.worldSize = worldSize;

    // Set canvas to fill the window
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());
  },

  /**
   * Resize the canvas to fill the window
   */
  resizeCanvas: function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  /**
   * Update camera position to follow the player
   * @param {Object} player - The player object
   */
  updateCamera: function (player) {
    // Center camera on player
    this.cameraOffsetX = player.x - this.canvas.width / 2;
    this.cameraOffsetY = player.y - this.canvas.height / 2;

    // Keep camera within world bounds
    this.cameraOffsetX = Math.max(
      0,
      Math.min(this.worldSize.width - this.canvas.width, this.cameraOffsetX)
    );
    this.cameraOffsetY = Math.max(
      0,
      Math.min(this.worldSize.height - this.canvas.height, this.cameraOffsetY)
    );
  },

  /**
   * Clear the canvas
   */
  clear: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  /**
   * Draw the game ground and grid
   */
  drawGround: function () {
    // Draw ground/background
    this.ctx.fillStyle = "#3c3";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid for visual reference
    this.ctx.strokeStyle = "#555";
    this.ctx.lineWidth = 1;

    // Vertical grid lines
    for (let x = 0; x < this.worldSize.width; x += 100) {
      const screenX = x - this.cameraOffsetX;
      if (screenX >= 0 && screenX <= this.canvas.width) {
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, 0);
        this.ctx.lineTo(screenX, this.canvas.height);
        this.ctx.stroke();
      }
    }

    // Horizontal grid lines
    for (let y = 0; y < this.worldSize.height; y += 100) {
      const screenY = y - this.cameraOffsetY;
      if (screenY >= 0 && screenY <= this.canvas.height) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, screenY);
        this.ctx.lineTo(this.canvas.width, screenY);
        this.ctx.stroke();
      }
    }

    // Draw world boundaries
    this.ctx.strokeStyle = "#fff";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(
      -this.cameraOffsetX,
      -this.cameraOffsetY,
      this.worldSize.width,
      this.worldSize.height
    );
  },

  /**
   * Draw the HUD (Heads-Up Display)
   * @param {Object} player - The player object
   * @param {number} score - The current score
   * @param {boolean} gameOver - Whether the game is over
   */
  drawHUD: function (player, score, gameOver) {
    // Draw player health bar
    const healthPercent = player.health / player.maxHealth;
    this.ctx.fillStyle = "#900";
    this.ctx.fillRect(20, this.canvas.height - 30, 200, 20);
    this.ctx.fillStyle = "#090";
    this.ctx.fillRect(20, this.canvas.height - 30, 200 * healthPercent, 20);
    this.ctx.strokeStyle = "#fff";
    this.ctx.strokeRect(20, this.canvas.height - 30, 200, 20);

    // Draw health value
    this.ctx.fillStyle = "white";
    this.ctx.font = "16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      Math.ceil(player.health) + "/" + player.maxHealth,
      120,
      this.canvas.height - 15
    );

    // Draw score and position
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText("Score: " + score, 20, 30);
    this.ctx.fillText(
      "Position: " + Math.floor(player.x) + ", " + Math.floor(player.y),
      20,
      60
    );

    // Draw game over message
    if (gameOver) {
      this.drawGameOver(score);
    }
  },

  /**
   * Draw the game over screen
   * @param {number} score - The final score
   * @param {number} level - The final level
   */
  drawGameOver: function (score, level) {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "48px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "GAME OVER",
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );

    this.ctx.font = "24px Arial";
    this.ctx.fillText(
      "Score: " + score,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.ctx.fillText(
      "Level: " + level,
      this.canvas.width / 2,
      this.canvas.height / 2 + 30
    );
    this.ctx.fillText(
      "Press R to restart",
      this.canvas.width / 2,
      this.canvas.height / 2 + 90
    );
  },

  /**
   * Convert world coordinates to screen coordinates
   * @param {number} x - World x coordinate
   * @param {number} y - World y coordinate
   * @returns {Object} Screen coordinates {x, y}
   */
  worldToScreen: function (x, y) {
    return {
      x: x - this.cameraOffsetX,
      y: y - this.cameraOffsetY,
    };
  },
};
