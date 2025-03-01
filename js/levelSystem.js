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

  // Calculate monsters needed for next level (exponential growth)
  calculateMonstersForNextLevel: function () {
    return Math.pow(2, this.currentLevel - 1);
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

      // Increase monster difficulty
      Monsters.settings.speed += 0.1;

      return true;
    }

    return false;
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

    if (key === "1" || key === "2" || key === "3") {
      const index = parseInt(key) - 1;
      this.selectUpgrade(index);
      return true;
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
        "Press 1, 2, or 3 to select",
        Renderer.canvas.width / 2,
        140
      );

      // Draw choices
      const choiceWidth = 200;
      const choiceHeight = 220;
      const choiceGap = 30;
      const startX =
        (Renderer.canvas.width - (choiceWidth * 3 + choiceGap * 2)) / 2;
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
