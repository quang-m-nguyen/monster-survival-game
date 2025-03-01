/**
 * Main Game module for the Monster Survival Game
 */

const Game = {
  // Game properties
  canvas: null,
  ctx: null,
  score: 0,
  gameOver: false,
  gamePaused: false,

  // World settings
  worldSize: {
    width: 3000,
    height: 3000,
  },

  // Ground setup
  ground: {
    color: "#3c3",
  },

  // Camera/viewport offset (needed for backward compatibility)
  cameraOffsetX: 0,
  cameraOffsetY: 0,

  // Message system
  message: "",
  messageTimer: 0,

  // Initialize the game
  init: function () {
    console.log("Game initializing...");

    // Set up canvas
    this.canvas = document.getElementById("gameCanvas");
    if (!this.canvas) {
      console.error("Canvas element not found!");
      return;
    }

    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) {
      console.error("Canvas context not found!");
      return;
    }

    // Initialize modules
    Renderer.init(this.canvas, this.worldSize);
    Input.init();
    Player.init();
    Bullets.init();
    Monsters.init();
    LevelSystem.init();

    // Show initial auto-fire message
    this.showMessage("Auto-fire enabled - Press F to toggle", 120);

    // Start game loop
    console.log("Starting game loop...");
    this.gameLoop();
  },

  // Game loop
  gameLoop: function () {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  },

  // Update game state
  update: function () {
    if (this.gameOver || this.gamePaused) return;

    // Update player
    Player.update();

    // Update camera
    Renderer.updateCamera(Player);

    // Sync camera offsets for backward compatibility
    this.cameraOffsetX = Renderer.cameraOffsetX;
    this.cameraOffsetY = Renderer.cameraOffsetY;

    // Update bullets
    Bullets.update();

    // Update monsters
    Monsters.update();

    // Update level system
    LevelSystem.update();

    // Update message timer
    if (this.messageTimer > 0) {
      this.messageTimer--;
    }
  },

  // Draw everything on the canvas
  draw: function () {
    // Clear canvas
    Renderer.clear();

    // Draw ground and grid
    Renderer.drawGround();

    // Draw monsters
    Monsters.draw(Renderer.ctx);

    // Draw bullets
    Bullets.draw(Renderer.ctx);

    // Draw player
    Player.draw(Renderer.ctx);

    // Draw touch target indicator if using touch controls
    if (Input.isMobile && Input.isTouching) {
      this.drawTouchTarget();
    }

    // Draw HUD
    Renderer.drawHUD(Player, this.score, this.gameOver);

    // Draw level system
    LevelSystem.draw(Renderer.ctx);

    // Draw status message if active
    this.drawMessage();

    // Draw game over screen if needed
    if (this.gameOver) {
      Renderer.drawGameOver(this.score, LevelSystem.currentLevel);
    }
  },

  // Show a status message
  showMessage: function (text, duration) {
    this.message = text;
    this.messageTimer = duration || 60; // Default 1 second at 60 FPS
  },

  // Draw the current status message
  drawMessage: function () {
    if (this.messageTimer > 0) {
      const alpha = Math.min(1, this.messageTimer / 30); // Fade out in the last half second
      Renderer.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      Renderer.ctx.font = "20px Arial";
      Renderer.ctx.textAlign = "center";
      Renderer.ctx.fillText(
        this.message,
        Renderer.canvas.width / 2,
        Renderer.canvas.height - 60
      );
    }
  },

  // Draw touch target indicator
  drawTouchTarget: function () {
    const targetPos = Renderer.worldToScreen(
      Input.touchTargetX,
      Input.touchTargetY
    );

    // Draw outer circle
    Renderer.ctx.beginPath();
    Renderer.ctx.arc(
      targetPos.x,
      targetPos.y,
      20 / Renderer.zoomFactor,
      0,
      Math.PI * 2
    );
    Renderer.ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    Renderer.ctx.lineWidth = 2 / Renderer.zoomFactor;
    Renderer.ctx.stroke();

    // Draw inner circle
    Renderer.ctx.beginPath();
    Renderer.ctx.arc(
      targetPos.x,
      targetPos.y,
      5 / Renderer.zoomFactor,
      0,
      Math.PI * 2
    );
    Renderer.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    Renderer.ctx.fill();
  },

  // Check for collision between two objects
  checkCollision: function (obj1, obj2) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  },

  // End the game
  endGame: function () {
    this.gameOver = true;
    console.log(
      "Game Over! Score: " + this.score + ", Level: " + LevelSystem.currentLevel
    );
  },

  // Restart the game
  restart: function () {
    // Reset game state
    this.gameOver = false;
    this.score = 0;
    this.message = "";
    this.messageTimer = 0;

    // Reset modules
    Player.reset();
    Bullets.init();
    Monsters.init();
    LevelSystem.init();

    // Show initial auto-fire message
    this.showMessage("Auto-fire enabled - Press F to toggle", 120);

    console.log("Game restarted");
  },
};

// Initialize the game when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  Game.init();
});
