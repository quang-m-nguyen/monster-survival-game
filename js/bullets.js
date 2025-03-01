/**
 * Antibodies module for the Micro Defender Game
 */

const Bullets = {
  list: [],

  // Antibody settings
  settings: {
    width: 10,
    height: 5,
    originalWidth: 10, // Store original width for reset
    originalHeight: 5, // Store original height for reset
    speed: 15,
    color: "#a5d6a7", // Light green
    cooldown: 15, // Frames between shots
    range: 500, // Maximum antibody travel distance
    damage: 10, // Base damage per antibody
    streams: 1, // Number of antibody streams (directions) fired at once
  },

  // Initialize antibodies
  init: function () {
    this.list = [];
    // Reset antibody size to original
    this.settings.width = this.settings.originalWidth;
    this.settings.height = this.settings.originalHeight;
    this.settings.streams = 1; // Reset streams to 1
  },

  // Create a new antibody
  create: function () {
    if (Player.shootCooldown <= 0) {
      // Get the primary direction (player's current direction)
      const primaryDirection = Player.direction;

      // Array to hold all directions to fire in
      const directionsToFire = [primaryDirection];

      // Add additional directions based on streams count
      if (this.settings.streams > 1) {
        const allDirections = ["right", "up", "left", "down"];
        const primaryIndex = allDirections.indexOf(primaryDirection);

        // Add directions clockwise from the primary direction
        for (let i = 1; i < this.settings.streams; i++) {
          const nextIndex = (primaryIndex + i) % 4;
          directionsToFire.push(allDirections[nextIndex]);
        }
      }

      // Create antibodies for each direction
      directionsToFire.forEach((direction) => {
        let bulletX = Player.x;
        let bulletY = Player.y + Player.height / 2 - this.settings.height / 2;
        let velocityX = 0;
        let velocityY = 0;

        switch (direction) {
          case "right":
            bulletX = Player.x + Player.width;
            velocityX = this.settings.speed;
            break;
          case "left":
            bulletX = Player.x - this.settings.width;
            velocityX = -this.settings.speed;
            break;
          case "up":
            bulletX = Player.x + Player.width / 2 - this.settings.width / 2;
            bulletY = Player.y - this.settings.height;
            velocityY = -this.settings.speed;
            break;
          case "down":
            bulletX = Player.x + Player.width / 2 - this.settings.width / 2;
            bulletY = Player.y + Player.height;
            velocityY = this.settings.speed;
            break;
        }

        this.list.push({
          x: bulletX,
          y: bulletY,
          width: this.settings.width,
          height: this.settings.height,
          velocityX,
          velocityY,
          distance: 0,
          direction: direction, // Store the direction for reference
          rotation: Math.random() * Math.PI * 2, // Random rotation for Y-shaped antibody
          rotationSpeed: (Math.random() - 0.5) * 0.2, // Rotation speed
          scale: 0.8 + Math.random() * 0.4, // Random size variation
          wobble: Math.random() * Math.PI * 2, // Phase for wobble animation
          wobbleSpeed: 0.1 + Math.random() * 0.1, // Speed of wobble
        });
      });

      // Set cooldown
      Player.shootCooldown = this.settings.cooldown;
    }
  },

  /**
   * Create antibodies that shoot toward the mouse cursor
   * This is an alternative to the direction-based shooting
   */
  createTowardsMouse: function () {
    if (Player.shootCooldown <= 0) {
      // Skip if on mobile with touch controls
      if (Input.isMobile && Input.isTouching) {
        // Fall back to regular direction-based shooting
        this.create();
        return;
      }

      // Get player center in world coordinates
      const playerCenterX = Player.x + Player.width / 2;
      const playerCenterY = Player.y + Player.height / 2;

      // Get player center in screen coordinates
      const playerScreenPos = Renderer.worldToScreen(
        playerCenterX,
        playerCenterY
      );

      // Calculate direction vector to mouse
      const dx = Input.mouseX - playerScreenPos.x;
      const dy = Input.mouseY - playerScreenPos.y;

      // Only proceed if mouse is far enough from player to determine direction
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        // Mouse too close to player, fall back to regular shooting
        this.create();
        return;
      }

      // Normalize the direction vector
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;

      // Convert screen direction to world direction
      // (no need to convert since we're just using the normalized vector)

      // Calculate bullet starting position
      // Start from the edge of the player in the direction of the mouse
      const bulletX = playerCenterX + (normalizedDx * Player.width) / 2;
      const bulletY = playerCenterY + (normalizedDy * Player.height) / 2;

      // Calculate bullet velocity
      const velocityX = normalizedDx * this.settings.speed;
      const velocityY = normalizedDy * this.settings.speed;

      // Determine the closest cardinal direction for animation purposes
      let direction;
      if (Math.abs(normalizedDx) > Math.abs(normalizedDy)) {
        direction = normalizedDx > 0 ? "right" : "left";
      } else {
        direction = normalizedDy > 0 ? "down" : "up";
      }

      // Create the antibody
      this.list.push({
        x: bulletX,
        y: bulletY,
        width: this.settings.width,
        height: this.settings.height,
        velocityX,
        velocityY,
        distance: 0,
        direction: direction, // Store the direction for reference
        rotation: Math.random() * Math.PI * 2, // Random rotation for Y-shaped antibody
        rotationSpeed: (Math.random() - 0.5) * 0.2, // Rotation speed
        scale: 0.8 + Math.random() * 0.4, // Random size variation
        wobble: Math.random() * Math.PI * 2, // Phase for wobble animation
        wobbleSpeed: 0.1 + Math.random() * 0.1, // Speed of wobble
      });

      // Set cooldown
      Player.shootCooldown = this.settings.cooldown;
    }
  },

  // Update all antibodies
  update: function () {
    if (Game.gamePaused) return;

    for (let i = 0; i < this.list.length; i++) {
      const antibody = this.list[i];

      // Update rotation and wobble
      antibody.rotation += antibody.rotationSpeed;
      antibody.wobble += antibody.wobbleSpeed;

      // Calculate wobble effect (slight side-to-side movement)
      const wobbleAmount = 0.3;
      let wobbleX = 0;
      let wobbleY = 0;

      if (antibody.velocityX !== 0) {
        // For horizontal movement, wobble vertically
        wobbleY = Math.sin(antibody.wobble) * wobbleAmount;
      } else {
        // For vertical movement, wobble horizontally
        wobbleX = Math.sin(antibody.wobble) * wobbleAmount;
      }

      // Move antibody with game speed multiplier and wobble
      antibody.x += (antibody.velocityX + wobbleX) * Game.gameSpeedMultiplier;
      antibody.y += (antibody.velocityY + wobbleY) * Game.gameSpeedMultiplier;

      // Update distance traveled
      antibody.distance += Math.sqrt(
        (antibody.velocityX * Game.gameSpeedMultiplier) ** 2 +
          (antibody.velocityY * Game.gameSpeedMultiplier) ** 2
      );

      // Remove antibodies that are off screen or exceed range
      if (
        antibody.x < 0 ||
        antibody.x > Game.worldSize.width ||
        antibody.y < 0 ||
        antibody.y > Game.worldSize.height ||
        antibody.distance > this.settings.range
      ) {
        this.list.splice(i, 1);
        i--;
        continue;
      }

      // Check for collision with monsters
      for (let j = 0; j < Monsters.list.length; j++) {
        if (Game.checkCollision(antibody, Monsters.list[j])) {
          // Damage monster
          Monsters.list[j].health -= this.settings.damage;

          // Remove antibody
          this.list.splice(i, 1);
          i--;

          // Remove monster if health <= 0
          if (Monsters.list[j].health <= 0) {
            // Apply life steal if player has it
            Player.handleMonsterKill();

            Monsters.list.splice(j, 1);
            j--;

            // Increase score
            Game.score += 10 * LevelSystem.currentLevel;

            // Handle level progression
            LevelSystem.handleMonsterKill();
          }

          break;
        }
      }
    }
  },

  // Draw all antibodies
  draw: function (ctx) {
    this.list.forEach((antibody) => {
      // Get screen coordinates using Renderer's worldToScreen method
      const screenPos = Renderer.worldToScreen(antibody.x, antibody.y);
      const screenWidth = antibody.width / Renderer.zoomFactor;
      const screenHeight = antibody.height / Renderer.zoomFactor;

      // Only draw antibodies that are on screen
      if (
        screenPos.x + screenWidth > 0 &&
        screenPos.x < Renderer.canvas.width &&
        screenPos.y + screenHeight > 0 &&
        screenPos.y < Renderer.canvas.height
      ) {
        // Save context for transformations
        ctx.save();

        // Determine base rotation based on antibody direction
        let baseRotation = 0;
        switch (antibody.direction) {
          case "right":
            baseRotation = 0;
            break;
          case "down":
            baseRotation = Math.PI / 2;
            break;
          case "left":
            baseRotation = Math.PI;
            break;
          case "up":
            baseRotation = (Math.PI * 3) / 2;
            break;
        }

        // Center of the antibody
        const centerX = screenPos.x + screenWidth / 2;
        const centerY = screenPos.y + screenHeight / 2;

        // Translate to center and rotate
        ctx.translate(centerX, centerY);
        ctx.rotate(baseRotation + antibody.rotation);

        // Scale based on antibody's scale property
        ctx.scale(antibody.scale, antibody.scale);

        // Draw Y-shaped antibody
        this.drawAntibody(ctx, screenWidth, screenHeight);

        // Restore context
        ctx.restore();
      }
    });
  },

  // Draw a Y-shaped antibody
  drawAntibody: function (ctx, width, height) {
    const baseSize = Math.max(width, height) * 1.5;
    const stemLength = baseSize * 0.6;
    const armLength = baseSize * 0.4;
    const thickness = baseSize * 0.15;

    // Draw antibody with a pulsating effect
    const time = Date.now() / 1000;
    const pulse = 0.9 + Math.sin(time * 3) * 0.1;

    // Draw the Y shape
    ctx.lineWidth = thickness * pulse;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Determine color based on damage (higher damage = more intense)
    const baseDamage = 10;
    const damageRatio = this.settings.damage / baseDamage;
    const intensity = Math.min(1, 0.7 + damageRatio * 0.3);

    // Create gradient for the antibody
    const gradient = ctx.createLinearGradient(0, -stemLength, 0, armLength);
    gradient.addColorStop(0, `rgba(200, 255, 200, ${intensity})`);
    gradient.addColorStop(0.5, `rgba(150, 230, 150, ${intensity})`);
    gradient.addColorStop(1, `rgba(100, 200, 100, ${intensity})`);

    ctx.strokeStyle = gradient;

    // Draw stem
    ctx.beginPath();
    ctx.moveTo(0, -stemLength);
    ctx.lineTo(0, 0);
    ctx.stroke();

    // Draw arms
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(armLength * 0.7, armLength);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-armLength * 0.7, armLength);
    ctx.stroke();

    // Draw binding sites (the parts that attach to pathogens)
    ctx.fillStyle = `rgba(220, 255, 220, ${intensity})`;

    // Left binding site
    ctx.beginPath();
    ctx.arc(-armLength * 0.7, armLength, thickness * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Right binding site
    ctx.beginPath();
    ctx.arc(armLength * 0.7, armLength, thickness * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Draw a subtle glow around the antibody
    const glowSize = baseSize * 1.2;
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
    glowGradient.addColorStop(0, `rgba(150, 255, 150, 0.3)`);
    glowGradient.addColorStop(1, `rgba(100, 200, 100, 0)`);

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
    ctx.fill();
  },
};
