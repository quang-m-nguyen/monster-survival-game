/**
 * Input module for the Monster Survival Game
 */

// Track key states
const Input = {
  keys: {},

  // Mouse position
  mouseX: 0,
  mouseY: 0,

  // Touch controls
  isTouching: false,
  touchX: 0,
  touchY: 0,
  touchTargetX: 0, // World coordinates target position
  touchTargetY: 0,
  isMobile: false, // Flag to detect mobile devices

  // Initialize input handlers
  init: function () {
    // Detect if device is mobile
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    console.log("Mobile device detected:", this.isMobile);

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

      // Toggle game speed with 'G' key
      if (e.key === "g" || e.key === "G") {
        Game.toggleGameSpeed();
        return;
      }

      // Manual fire with space (even with auto-fire enabled)
      if (e.key === " " && Player.shootCooldown <= 0) {
        if (!this.isMobile) {
          Bullets.createTowardsMouse();
        } else {
          Bullets.create();
        }
      }

      // Restart game when pressing R
      if (e.key === "r" && Game.gameOver) {
        Game.restart();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    // Set up mouse event listeners
    Renderer.canvas.addEventListener("mousemove", (e) => {
      const rect = Renderer.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });

    Renderer.canvas.addEventListener("click", (e) => {
      const rect = Renderer.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check if click is on upgrade panel first
      if (LevelSystem.handleClick(clickX, clickY)) {
        return; // Click was handled by upgrade panel
      }

      // If game is over, restart on click
      if (Game.gameOver) {
        Game.restart();
        return;
      }

      // If not on mobile, handle shooting on click
      if (!this.isMobile) {
        // Manual fire with mouse click
        if (Player.shootCooldown <= 0) {
          Bullets.createTowardsMouse();
        }
        return;
      }

      // If we get here, we're on mobile, so handle movement
      // Convert screen coordinates to world coordinates for movement
      this.handleMovementInput(clickX, clickY);
    });

    // Set up touch event listeners for mobile
    Renderer.canvas.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault(); // Prevent scrolling

        if (Game.gameOver) {
          Game.restart();
          return;
        }

        const rect = Renderer.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.touchX = touch.clientX - rect.left;
        this.touchY = touch.clientY - rect.top;
        this.isTouching = true;

        // Check if touch is on upgrade panel first
        if (LevelSystem.handleClick(this.touchX, this.touchY)) {
          return; // Touch was handled by upgrade panel
        }

        // Handle movement touch
        this.handleMovementInput(this.touchX, this.touchY);
      },
      { passive: false }
    );

    Renderer.canvas.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault(); // Prevent scrolling

        const rect = Renderer.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        this.touchX = touch.clientX - rect.left;
        this.touchY = touch.clientY - rect.top;

        // Update movement target while dragging
        this.handleMovementInput(this.touchX, this.touchY);
      },
      { passive: false }
    );

    Renderer.canvas.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault(); // Prevent scrolling
        this.isTouching = false;
      },
      { passive: false }
    );
  },

  // Handle movement input (touch or click)
  handleMovementInput: function (screenX, screenY) {
    // Convert screen coordinates to world coordinates using the Renderer method
    const worldPos = Renderer.screenToWorld(screenX, screenY);

    // Set target position
    this.touchTargetX = worldPos.x;
    this.touchTargetY = worldPos.y;

    // Also trigger a shot toward the touch position if cooldown allows
    if (Player.shootCooldown <= 0) {
      Bullets.createTowardsMouse();
    }

    console.log(`Movement target set: ${worldPos.x}, ${worldPos.y}`);
  },

  // Update input state
  update: function () {
    // Handle touch-based movement on mobile
    if (
      this.isMobile &&
      this.isTouching &&
      !Game.gamePaused &&
      !Game.gameOver
    ) {
      // Calculate direction to target
      const dx = this.touchTargetX - (Player.x + Player.width / 2);
      const dy = this.touchTargetY - (Player.y + Player.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only move if we're not very close to the target
      if (distance > Player.speed * 2) {
        // Normalize direction and apply player speed
        const moveX = (dx / distance) * Player.speed;
        const moveY = (dy / distance) * Player.speed;

        // Update player position
        Player.x += moveX;
        Player.y += moveY;

        // Update player direction based on movement
        if (Math.abs(moveX) > Math.abs(moveY)) {
          // Moving more horizontally than vertically
          Player.direction = moveX > 0 ? "right" : "left";
        } else {
          // Moving more vertically than horizontally
          Player.direction = moveY > 0 ? "down" : "up";
        }

        // Keep player within world bounds
        Player.x = Math.max(
          0,
          Math.min(Game.worldSize.width - Player.width, Player.x)
        );
        Player.y = Math.max(
          0,
          Math.min(Game.worldSize.height - Player.height, Player.y)
        );
      }
    }
  },
};
