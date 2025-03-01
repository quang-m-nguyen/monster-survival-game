/**
 * Player module for the Monster Survival Game
 */

const Player = {
  x: 0,
  y: 0,
  width: 40,
  height: 40,
  speed: 5,
  color: "white",
  shootCooldown: 0,
  health: 100,
  maxHealth: 100,
  direction: "right", // Current facing direction: 'right', 'left', 'up', 'down'
  lifeStealAmount: 0, // Amount of health gained per monster kill

  // Initialize player
  init: function () {
    this.x = Game.worldSize.width / 2;
    this.y = Game.worldSize.height / 2;
    this.speed = 5;
    this.health = 100;
    this.maxHealth = 100;
    this.shootCooldown = 0;
    this.direction = "right";
    this.lifeStealAmount = 0;
  },

  // Update player state
  update: function () {
    if (Game.gamePaused) return;

    // Decrease shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
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
    // Draw player
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - Game.cameraOffsetX,
      this.y - Game.cameraOffsetY,
      this.width,
      this.height
    );

    // Draw player direction indicator
    ctx.fillStyle = "#0ff";
    switch (this.direction) {
      case "right":
        ctx.fillRect(
          this.x - Game.cameraOffsetX + this.width,
          this.y - Game.cameraOffsetY + this.height / 2 - 2,
          10,
          4
        );
        break;
      case "left":
        ctx.fillRect(
          this.x - Game.cameraOffsetX - 10,
          this.y - Game.cameraOffsetY + this.height / 2 - 2,
          10,
          4
        );
        break;
      case "up":
        ctx.fillRect(
          this.x - Game.cameraOffsetX + this.width / 2 - 2,
          this.y - Game.cameraOffsetY - 10,
          4,
          10
        );
        break;
      case "down":
        ctx.fillRect(
          this.x - Game.cameraOffsetX + this.width / 2 - 2,
          this.y - Game.cameraOffsetY + this.height,
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
