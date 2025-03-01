/**
 * Main Game module for the Retro Side Scroller game
 */

const Game = {
  // Game properties
  canvas: null,
  ctx: null,
  gameSpeed: 5,
  score: 0,
  gameOver: false,

  // Camera/viewport offset
  cameraOffsetX: 0,
  cameraOffsetY: 0,

  // Background setup for parallax effect
  background: {
    x: 0,
    width: 0,
    speed: 2,
  },

  // Ground setup
  ground: {
    y: 540,
    height: 60,
  },

  // World boundaries
  worldBounds: {
    left: 0,
    top: 0,
    right: 5000, // Large value for right boundary
    bottom: 600, // Same as canvas height initially
  },

  // Initialize the game
  init: function () {
    console.log("Game initializing...");

    // Get canvas and context
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    if (!this.ctx) {
      console.error("Canvas context not found!");
      return;
    }

    // Set background width to canvas width
    this.background.width = this.canvas.width;

    // Initialize modules
    Input.init();
    Obstacles.init();
    Bullets.init();
    Renderer.init(this.ctx);

    console.log("Starting game loop...");
    this.gameLoop();
  },

  // Game loop
  gameLoop: function () {
    Game.update();
    Renderer.draw();
    requestAnimationFrame(Game.gameLoop);
  },

  // Update game state
  update: function () {
    if (this.gameOver) return;

    // Update player
    Player.update();

    // Update obstacles
    Obstacles.update();

    // Update bullets
    Bullets.update();

    // Update background based on player movement
    this.updateBackground();
  },

  // Update background position for parallax effect
  updateBackground: function () {
    if (Input.keys["ArrowRight"] && Player.x >= this.canvas.width / 2) {
      // Moving right beyond half screen
      this.background.x -= Player.speed;
      if (this.background.x <= -this.background.width) {
        this.background.x = 0;
      }
    } else if (Input.keys["ArrowLeft"] && this.cameraOffsetX > 0) {
      // Moving left with camera offset
      this.background.x += Player.speed;
      if (this.background.x > 0) {
        this.background.x = -this.background.width + this.background.x;
      }
    }
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

  // Restart the game
  restart: function () {
    // Reset game state
    this.gameOver = false;
    this.score = 0;
    this.gameSpeed = 5;
    this.cameraOffsetX = 0;
    this.cameraOffsetY = 0;

    // Reset player
    Player.reset();

    // Reset bullets
    Bullets.init();

    // Reset obstacles
    Obstacles.init();
  },
};

// Initialize the game when the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  Game.init();
});
