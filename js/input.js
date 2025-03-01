/**
 * Input module for the Monster Survival Game
 */

// Track key states
const Input = {
  keys: {},

  // Initialize input handlers
  init: function () {
    // Event listeners for key presses
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;

      // Handle level up choices
      if (LevelSystem.handleInput(e.key)) {
        return;
      }

      // Fire bullet when pressing space
      if (e.key === " " && Player.shootCooldown <= 0) {
        Bullets.create();

        // Set cooldown
        Player.shootCooldown = Bullets.settings.cooldown;
      }

      // Restart game when pressing R
      if (e.key === "r" && Game.gameOver) {
        Game.restart();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  },
};
