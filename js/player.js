/**
 * Player module for the Retro Side Scroller game
 */

const Player = {
  x: 100, // Starting x position
  y: 500,
  width: 40,
  height: 40,
  speed: 7,
  jumping: false,
  jumpForce: 15,
  gravity: 0.8,
  velocityY: 0,
  attacking: false,
  color: "white",
  shootCooldown: 0,

  // Update player state
  update: function () {
    // Decrease shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    // Horizontal movement
    if (Input.keys["ArrowRight"]) {
      this.x += this.speed;

      // If player moves beyond half the screen, move the camera instead
      if (this.x > Game.canvas.width / 2) {
        Game.cameraOffsetX += this.speed;
        this.x = Game.canvas.width / 2;

        // Check if we need to generate more obstacles as player moves right
        if (
          Obstacles.list.length < 5 ||
          (Obstacles.list.length > 0 &&
            Obstacles.list[Obstacles.list.length - 1].x <
              Game.canvas.width + Game.cameraOffsetX)
        ) {
          Obstacles.generate();
        }
      }
    }

    if (Input.keys["ArrowLeft"]) {
      // First check if we need to move the camera
      if (Game.cameraOffsetX > 0) {
        // Move camera left
        Game.cameraOffsetX -= this.speed;
        if (Game.cameraOffsetX < 0) Game.cameraOffsetX = 0;
      }
      // Then check if we can move the player
      else if (this.x > 50) {
        // Move player left if not at the left boundary
        this.x -= this.speed;
      }
    }

    // Vertical movement
    // Only allow direct up/down movement if not jumping or if in the air
    if (Input.keys["ArrowUp"] && !this.jumping) {
      this.y -= this.speed;

      // Camera follows player vertically
      if (this.y < Game.canvas.height / 3 && Game.cameraOffsetY > 0) {
        Game.cameraOffsetY -= this.speed;
        this.y = Game.canvas.height / 3;
      }
    }

    if (Input.keys["ArrowDown"]) {
      this.y += this.speed;

      // Camera follows player vertically
      if (this.y > (Game.canvas.height * 2) / 3) {
        Game.cameraOffsetY += this.speed;
        this.y = (Game.canvas.height * 2) / 3;
      }
    }

    // Apply gravity to player only if jumping
    if (this.jumping) {
      this.velocityY += this.gravity;
      this.y += this.velocityY;

      // Check if player is on ground
      if (this.y + this.height >= Game.ground.y - Game.cameraOffsetY) {
        this.y = Game.ground.y - this.height - Game.cameraOffsetY;
        this.jumping = false;
        this.velocityY = 0;
      }
    }

    // Keep player within world bounds
    this.y = Math.max(
      Game.worldBounds.top,
      Math.min(Game.ground.y - this.height - Game.cameraOffsetY, this.y)
    );
  },

  // Reset player to initial state
  reset: function () {
    this.x = 100;
    this.y = 500;
    this.jumping = false;
    this.velocityY = 0;
    this.shootCooldown = 0;
  },
};
