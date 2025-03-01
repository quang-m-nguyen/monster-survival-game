/**
 * Level System module for the Monster Survival Game
 */

const LevelSystem = {
  currentLevel: 1,
  monstersKilled: 0,
  monstersToNextLevel: 1, // Start with 1 monster to reach level 2
  levelUpMessage: "",
  levelUpMessageTimer: 0,
  levelUpMessageDuration: 120, // 2 seconds at 60 FPS

  // Upgrade system
  showingUpgradeChoices: false,
  upgradeChoices: [
    {
      name: "Attack Speed",
      description: "Decrease bullet cooldown by 15%",
      icon: "⚡",
      apply: function () {
        // Reduce cooldown (faster firing)
        Bullets.settings.cooldown = Math.max(
          5,
          Math.floor(Bullets.settings.cooldown * 0.85)
        );
        return `Attack speed increased! Cooldown: ${Bullets.settings.cooldown}`;
      },
    },
    {
      name: "Attack Damage",
      description: "Increase bullet damage by 30%",
      icon: "💥",
      apply: function () {
        // Increase damage
        Bullets.settings.damage = Math.floor(Bullets.settings.damage * 1.3);
        return `Damage increased to ${Bullets.settings.damage}!`;
      },
    },
    {
      name: "Life Steal",
      description: "Gain health for each monster killed",
      icon: "❤️",
      apply: function () {
        // Increase life steal amount
        Player.lifeStealAmount += 2;
        return `Life steal increased to ${Player.lifeStealAmount} health per kill!`;
      },
    },
    {
      name: "Multi-Shot",
      description: "Add an additional bullet stream",
      icon: "🔫",
      apply: function () {
        // Increase number of bullet streams
        Bullets.settings.streams++;
        return `Multi-Shot! Now firing ${Bullets.settings.streams} bullet streams!`;
      },
    },
  ],
  selectedUpgrade: -1,
  upgradeResult: "",
  upgradeResultTimer: 0,
  upgradeResultDuration: 180, // 3 seconds at 60 FPS

  // Initialize the level system
  init: function () {
    this.currentLevel = 1;
    this.monstersKilled = 0;
    this.monstersToNextLevel = this.calculateMonstersForNextLevel();
    this.levelUpMessage = "";
    this.levelUpMessageTimer = 0;
    this.showingUpgradeChoices = false;
    this.selectedUpgrade = -1;
    this.upgradeResult = "";
    this.upgradeResultTimer = 0;
  },

  // Calculate monsters needed for next level (balanced progression)
  calculateMonstersForNextLevel: function () {
    // Easy early game (levels 1-5)
    if (this.currentLevel <= 1) {
      return 1; // Level 1: 1 monster
    } else if (this.currentLevel <= 5) {
      return 2; // Levels 2-5: 2 monsters each
    } else if (this.currentLevel <= 10) {
      // Levels 6-10: Gradual increase
      return 3 + Math.floor((this.currentLevel - 5) / 2);
    } else if (this.currentLevel <= 20) {
      // Levels 11-20: Moderate increase to slow down progression
      return 6 + Math.floor((this.currentLevel - 10) / 2);
    } else {
      // Levels 21+: More significant increase to prevent excessive leveling
      return 11 + (this.currentLevel - 20);
    }

    // This creates a balanced progression:
    // Level 1: 1 monster
    // Levels 2-5: 2 monsters each
    // Levels 6-7: 3 monsters each
    // Levels 8-9: 4 monsters each
    // Level 10: 5 monsters
    // Levels 11-12: 6 monsters each
    // Levels 13-14: 7 monsters each
    // Levels 15-16: 8 monsters each
    // Levels 17-18: 9 monsters each
    // Levels 19-20: 10 monsters each
    // Level 21: 12 monsters
    // Level 22: 13 monsters
    // etc.
  },

  // Handle monster kill and check for level up
  handleMonsterKill: function () {
    this.monstersKilled++;

    // Check if player should level up
    if (this.monstersKilled >= this.monstersToNextLevel) {
      this.currentLevel++;
      this.monstersKilled = 0;
      this.monstersToNextLevel = this.calculateMonstersForNextLevel();

      // Display level up message
      this.levelUpMessage = "LEVEL UP! Level " + this.currentLevel;
      this.levelUpMessageTimer = this.levelUpMessageDuration;

      // Show upgrade choices
      this.showingUpgradeChoices = true;
      Game.gamePaused = true;

      // Basic level up benefits (regardless of choice)
      Player.maxHealth += 10;
      Player.health = Math.min(Player.health + 20, Player.maxHealth); // Heal on level up
      Player.speed += 0.2; // Slight speed increase

      // Increase player size (up to a maximum)
      this.increasePlayerSize();

      // Increase bullet size
      this.increaseBulletSize();

      // Increase monster difficulty with diminishing returns
      this.increaseMonsterDifficulty();

      return true;
    }

    return false;
  },

  // Increase monster difficulty with diminishing returns
  increaseMonsterDifficulty: function () {
    // Calculate speed increase with diminishing returns
    let speedIncrease;

    if (this.currentLevel <= 5) {
      // Early levels: Normal speed increase
      speedIncrease = 0.1;
    } else if (this.currentLevel <= 10) {
      // Mid levels: Slightly reduced speed increase
      speedIncrease = 0.08;
    } else if (this.currentLevel <= 15) {
      // Higher levels: Further reduced speed increase
      speedIncrease = 0.05;
    } else if (this.currentLevel <= 20) {
      // Very high levels: Minimal speed increase
      speedIncrease = 0.03;
    } else {
      // Beyond level 20: Extremely small speed increase
      speedIncrease = 0.02;
    }

    // Apply the calculated speed increase
    Monsters.settings.speed += speedIncrease;

    // Optionally show a message about monster difficulty
    if (this.currentLevel % 5 === 0) {
      Game.showMessage(
        `Monsters are getting stronger! Speed: ${Monsters.settings.speed.toFixed(
          1
        )}`,
        120
      );
    }
  },

  // Increase player size on level up
  increasePlayerSize: function () {
    // Increase size by 5% per level, up to a maximum of 100% increase (2x original size)
    const maxSizeMultiplier = 2.0; // Maximum size is 2x the original
    const sizeIncreasePerLevel = 0.05; // 5% increase per level

    // Calculate new size based on level
    const sizeMultiplier = Math.min(
      maxSizeMultiplier,
      1 + (this.currentLevel - 1) * sizeIncreasePerLevel
    );

    // Update player size
    Player.width = Math.floor(40 * sizeMultiplier);
    Player.height = Math.floor(40 * sizeMultiplier);

    // Adjust player position to prevent going out of bounds after size increase
    Player.x = Math.min(Player.x, Game.worldSize.width - Player.width);
    Player.y = Math.min(Player.y, Game.worldSize.height - Player.height);

    Game.showMessage(
      `Player size increased to ${Math.floor(
        sizeMultiplier * 100
      )}% of original`,
      60
    );
  },

  // Increase bullet size on level up
  increaseBulletSize: function () {
    // Increase bullet size by 5% per level, up to a maximum of 100% increase
    const maxSizeMultiplier = 2.0;
    const sizeIncreasePerLevel = 0.05;

    // Calculate new size based on level
    const sizeMultiplier = Math.min(
      maxSizeMultiplier,
      1 + (this.currentLevel - 1) * sizeIncreasePerLevel
    );

    // Update bullet size
    Bullets.settings.width = Math.floor(10 * sizeMultiplier);
    Bullets.settings.height = Math.floor(5 * sizeMultiplier);
  },

  // Handle upgrade selection
  selectUpgrade: function (index) {
    if (index >= 0 && index < this.upgradeChoices.length) {
      this.selectedUpgrade = index;
      this.upgradeResult = this.upgradeChoices[index].apply();
      this.upgradeResultTimer = this.upgradeResultDuration;
      this.showingUpgradeChoices = false;
      Game.gamePaused = false;
    }
  },

  // Handle keyboard input for upgrade selection
  handleInput: function (key) {
    if (!this.showingUpgradeChoices) return false;

    if (key === "1" || key === "2" || key === "3" || key === "4") {
      const index = parseInt(key) - 1;
      if (index < this.upgradeChoices.length) {
        this.selectUpgrade(index);
        return true;
      }
    }

    return false;
  },

  // Update level system
  update: function () {
    // Update level up message timer
    if (this.levelUpMessageTimer > 0) {
      this.levelUpMessageTimer--;
    }

    // Update upgrade result timer
    if (this.upgradeResultTimer > 0) {
      this.upgradeResultTimer--;
    }
  },

  // Draw level information
  draw: function (ctx) {
    // Draw level info
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Level: " + this.currentLevel, 20, 120);
    ctx.fillText(
      "Monsters to next level: " +
        (this.monstersToNextLevel - this.monstersKilled),
      20,
      150
    );

    // Draw level progress bar
    const progressWidth = 200;
    const progressHeight = 10;
    const progressX = 20;
    const progressY = 160;
    const progressPercent = this.monstersKilled / this.monstersToNextLevel;

    ctx.fillStyle = "#555";
    ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
    ctx.fillStyle = "#0ff";
    ctx.fillRect(
      progressX,
      progressY,
      progressWidth * progressPercent,
      progressHeight
    );
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(progressX, progressY, progressWidth, progressHeight);

    // Draw level up message if active
    if (this.levelUpMessageTimer > 0) {
      const alpha = Math.min(1, this.levelUpMessageTimer / 60); // Fade out in the last second
      ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
      ctx.font = "36px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        this.levelUpMessage,
        Renderer.canvas.width / 2,
        Renderer.canvas.height / 3
      );
    }

    // Draw upgrade result message if active
    if (this.upgradeResultTimer > 0) {
      const alpha = Math.min(1, this.upgradeResultTimer / 60); // Fade out in the last second
      ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
      ctx.font = "28px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        this.upgradeResult,
        Renderer.canvas.width / 2,
        Renderer.canvas.height / 4
      );
    }

    // Draw upgrade choices if showing
    if (this.showingUpgradeChoices) {
      // Draw semi-transparent background
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(0, 0, Renderer.canvas.width, Renderer.canvas.height);

      // Draw title
      ctx.fillStyle = "white";
      ctx.font = "36px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Choose an Upgrade", Renderer.canvas.width / 2, 100);

      // Draw instructions
      ctx.font = "18px Arial";
      ctx.fillText(
        "Press 1, 2, 3, or 4 to select",
        Renderer.canvas.width / 2,
        140
      );

      // Draw choices
      const choiceWidth = 200;
      const choiceHeight = 220;
      const choiceGap = 30;
      const totalWidth =
        choiceWidth * this.upgradeChoices.length +
        choiceGap * (this.upgradeChoices.length - 1);
      const startX = (Renderer.canvas.width - totalWidth) / 2;
      const startY = 180;

      for (let i = 0; i < this.upgradeChoices.length; i++) {
        const choice = this.upgradeChoices[i];
        const x = startX + i * (choiceWidth + choiceGap);
        const y = startY;

        // Draw choice background
        ctx.fillStyle = "rgba(50, 50, 80, 0.9)";
        ctx.fillRect(x, y, choiceWidth, choiceHeight);
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, choiceWidth, choiceHeight);

        // Draw choice number
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "left";
        ctx.fillText(`${i + 1}.`, x + 10, y + 30);

        // Draw choice icon
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText(choice.icon, x + choiceWidth / 2, y + 80);

        // Draw choice name
        ctx.font = "24px Arial";
        ctx.fillText(choice.name, x + choiceWidth / 2, y + 130);

        // Draw choice description
        ctx.font = "16px Arial";
        ctx.fillText(choice.description, x + choiceWidth / 2, y + 170);
      }
    }
  },
};
