/**
 * Input handling module for the Retro Side Scroller game
 */

// Track key states
const Input = {
  keys: {},

  // Initialize input handlers
  init: function () {
    // Event listeners for key presses
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;

      // Jump with 'w' key, but only if not already jumping and on the ground
      if (
        e.key === "w" &&
        !Player.jumping &&
        Player.y + Player.height >= Game.ground.y - Game.cameraOffsetY - 5
      ) {
        Player.jumping = true;
        Player.velocityY = -Player.jumpForce;
      }

      // Fire bullet when pressing space
      if (e.key === " " && Player.shootCooldown <= 0) {
        Bullets.create();

        // Set cooldown
        Player.shootCooldown = Bullets.settings.cooldown;
      }

      // Restart game
      if (e.key === "r" && Game.gameOver) {
        Game.restart();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  },
};
