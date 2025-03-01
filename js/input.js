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

      // Toggle auto-fire with 'F' key
      if (e.key === "f" || e.key === "F") {
        const autoFireEnabled = Player.toggleAutoFire();
        console.log("Auto-fire " + (autoFireEnabled ? "enabled" : "disabled"));

        // Show auto-fire status message
        Game.showMessage(
          "Auto-fire " + (autoFireEnabled ? "enabled" : "disabled"),
          60
        );

        return;
      }

      // Manual fire with space (even with auto-fire enabled)
      if (e.key === " " && Player.shootCooldown <= 0) {
        Bullets.create();
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
