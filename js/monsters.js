/**
 * Monsters module for the Monster Survival Game
 */

const Monsters = {
  list: [],

  settings: {
    minWidth: 30,
    maxWidth: 50,
    minHeight: 30,
    maxHeight: 50,
    speed: 2,
    spawnRate: 120, // Frames between monster spawns
    spawnCounter: 0,
    maxMonsters: 20,
    color: "#f55",
  },

  // Initialize monsters
  init: function () {
    this.list = [];
    this.settings.spawnCounter = 0;
    this.settings.spawnRate = 120;
    this.settings.speed = 2;
  },

  // Generate a new monster from a random direction
  generate: function () {
    if (this.list.length >= this.settings.maxMonsters) return;

    const width =
      Math.floor(
        Math.random() * (this.settings.maxWidth - this.settings.minWidth + 1)
      ) + this.settings.minWidth;
    const height =
      Math.floor(
        Math.random() * (this.settings.maxHeight - this.settings.minHeight + 1)
      ) + this.settings.minHeight;

    // Determine spawn position (outside the visible area)
    let x, y;
    const spawnSide = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

    switch (spawnSide) {
      case 0: // Top
        x = Math.random() * Game.worldSize.width;
        y = Math.max(0, Renderer.cameraOffsetY - height * 2);
        break;
      case 1: // Right
        x = Math.min(
          Game.worldSize.width,
          Renderer.cameraOffsetX + Renderer.canvas.width + width * 2
        );
        y = Math.random() * Game.worldSize.height;
        break;
      case 2: // Bottom
        x = Math.random() * Game.worldSize.width;
        y = Math.min(
          Game.worldSize.height,
          Renderer.cameraOffsetY + Renderer.canvas.height + height * 2
        );
        break;
      case 3: // Left
        x = Math.max(0, Renderer.cameraOffsetX - width * 2);
        y = Math.random() * Game.worldSize.height;
        break;
    }

    // Ensure monster is within world bounds
    x = Math.max(0, Math.min(Game.worldSize.width - width, x));
    y = Math.max(0, Math.min(Game.worldSize.height - height, y));

    // Scale monster health with level
    const monsterHealth = 20 + (LevelSystem.currentLevel - 1) * 5;

    this.list.push({
      x,
      y,
      width,
      height,
      speed: this.settings.speed,
      health: monsterHealth,
      maxHealth: monsterHealth,
    });
  },

  // Update all monsters
  update: function () {
    if (Game.gamePaused) return;

    // Spawn monsters - adjust spawn rate based on level
    this.settings.spawnCounter++;
    const adjustedSpawnRate = Math.max(
      30,
      this.settings.spawnRate - LevelSystem.currentLevel * 5
    );
    if (this.settings.spawnCounter >= adjustedSpawnRate) {
      this.generate();
      this.settings.spawnCounter = 0;
    }

    // Update monsters
    for (let i = 0; i < this.list.length; i++) {
      const monster = this.list[i];

      // Move monster towards player
      const dx = Player.x - monster.x;
      const dy = Player.y - monster.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        monster.x += (dx / distance) * monster.speed;
        monster.y += (dy / distance) * monster.speed;
      }

      // Check for collision with player
      if (Game.checkCollision(Player, monster)) {
        // Damage scales with level
        const monsterDamage = 1 + Math.floor(LevelSystem.currentLevel / 3);
        Player.health -= monsterDamage;

        // Push player away slightly
        Player.x += (Player.x - monster.x) * 0.1;
        Player.y += (Player.y - monster.y) * 0.1;

        // Keep player within bounds after push
        Player.x = Math.max(
          0,
          Math.min(Game.worldSize.width - Player.width, Player.x)
        );
        Player.y = Math.max(
          0,
          Math.min(Game.worldSize.height - Player.height, Player.y)
        );

        if (Player.health <= 0) {
          Game.endGame();
        }
      }
    }
  },

  // Draw all monsters
  draw: function (ctx) {
    ctx.fillStyle = this.settings.color;
    this.list.forEach((monster) => {
      const screenX = monster.x - Renderer.cameraOffsetX;
      const screenY = monster.y - Renderer.cameraOffsetY;

      // Only draw monsters that are on screen
      if (
        screenX + monster.width > 0 &&
        screenX < Renderer.canvas.width &&
        screenY + monster.height > 0 &&
        screenY < Renderer.canvas.height
      ) {
        ctx.fillRect(screenX, screenY, monster.width, monster.height);

        // Draw monster health bar
        const healthPercent = monster.health / monster.maxHealth;
        ctx.fillStyle = "#900";
        ctx.fillRect(screenX, screenY - 10, monster.width, 5);
        ctx.fillStyle = "#090";
        ctx.fillRect(screenX, screenY - 10, monster.width * healthPercent, 5);

        // Reset fill style for next monster
        ctx.fillStyle = this.settings.color;
      }
    });
  },
};
