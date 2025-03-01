/**
 * Player module for the Monster Survival Game
 */

const Player = {
  x: 0,
  y: 0,
  width: 40,
  height: 40,
  originalWidth: 40, // Store original width for reset
  originalHeight: 40, // Store original height for reset
  speed: 5,
  color: "white",
  shootCooldown: 0,
  health: 100,
  maxHealth: 100,
  direction: "right", // Current facing direction: 'right', 'left', 'up', 'down'
  lifeStealAmount: 0, // Amount of health gained per monster kill
  autoFire: true, // Auto-fire bullets

  // Initialize player
  init: function () {
    this.x = Game.worldSize.width / 2;
    this.y = Game.worldSize.height / 2;
    this.width = this.originalWidth;
    this.height = this.originalHeight;
    this.speed = 5;
    this.health = 100;
    this.maxHealth = 100;
    this.shootCooldown = 0;
    this.direction = "right";
    this.lifeStealAmount = 0;
    this.autoFire = true;
  },

  // Reset player (for game restart)
  reset: function () {
    this.init();
  },

  // Update player state
  update: function () {
    if (Game.gamePaused) return;

    // Decrease shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    // Auto-fire bullets when cooldown is ready
    if (this.autoFire && this.shootCooldown <= 0) {
      Bullets.create();
    }

    // Update player position based on key presses
    let playerMoved = false;

    if (Input.keys["ArrowRight"] || Input.keys["d"]) {
      this.x += this.speed;
      this.direction = "right";
      playerMoved = true;
    }

    if (Input.keys["ArrowLeft"] || Input.keys["a"]) {
      this.x -= this.speed;
      this.direction = "left";
      playerMoved = true;
    }

    if (Input.keys["ArrowUp"] || Input.keys["w"]) {
      this.y -= this.speed;
      this.direction = "up";
      playerMoved = true;
    }

    if (Input.keys["ArrowDown"] || Input.keys["s"]) {
      this.y += this.speed;
      this.direction = "down";
      playerMoved = true;
    }

    // Keep player within world bounds
    this.x = Math.max(0, Math.min(Game.worldSize.width - this.width, this.x));
    this.y = Math.max(0, Math.min(Game.worldSize.height - this.height, this.y));
  },

  // Toggle auto-fire
  toggleAutoFire: function () {
    this.autoFire = !this.autoFire;
    return this.autoFire;
  },

  // Handle monster kill (for life steal)
  handleMonsterKill: function () {
    if (this.lifeStealAmount > 0) {
      this.health = Math.min(
        this.health + this.lifeStealAmount,
        this.maxHealth
      );
    }
  },

  // Draw player
  draw: function (ctx) {
    // Get screen coordinates
    const screenX = this.x - Renderer.cameraOffsetX;
    const screenY = this.y - Renderer.cameraOffsetY;

    // Draw player
    ctx.fillStyle = this.color;
    ctx.fillRect(screenX, screenY, this.width, this.height);

    // Draw player direction indicator
    ctx.fillStyle = "#0ff";
    switch (this.direction) {
      case "right":
        ctx.fillRect(
          screenX + this.width,
          screenY + this.height / 2 - 2,
          10,
          4
        );
        break;
      case "left":
        ctx.fillRect(screenX - 10, screenY + this.height / 2 - 2, 10, 4);
        break;
      case "up":
        ctx.fillRect(screenX + this.width / 2 - 2, screenY - 10, 4, 10);
        break;
      case "down":
        ctx.fillRect(
          screenX + this.width / 2 - 2,
          screenY + this.height,
          4,
          10
        );
        break;
    }

    // Draw player health bar
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = "#900";
    ctx.fillRect(20, Game.canvas.height - 30, 200, 20);
    ctx.fillStyle = "#090";
    ctx.fillRect(20, Game.canvas.height - 30, 200 * healthPercent, 20);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(20, Game.canvas.height - 30, 200, 20);

    // Draw health value
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      Math.ceil(this.health) + "/" + this.maxHealth,
      120,
      Game.canvas.height - 15
    );
  },
};
