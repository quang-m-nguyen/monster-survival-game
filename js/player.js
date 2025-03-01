/**
 * Player module for the Micro Defender Game
 */

const Player = {
  x: 0,
  y: 0,
  width: 40,
  height: 40,
  originalWidth: 40, // Store original width for reset
  originalHeight: 40, // Store original height for reset
  speed: 5,
  color: "white",
  shootCooldown: 0,
  health: 100,
  maxHealth: 100,
  direction: "right", // Current facing direction: 'right', 'left', 'up', 'down'
  lifeStealAmount: 0, // Amount of health gained per monster kill
  autoFire: true, // Auto-fire bullets
  pseudopods: [], // Array to store pseudopod animations
  nucleusPhase: 0, // For nucleus animation

  // Initialize player
  init: function () {
    this.x = Game.worldSize.width / 2;
    this.y = Game.worldSize.height / 2;
    this.width = this.originalWidth;
    this.height = this.originalHeight;
    this.speed = 5;
    this.health = 100;
    this.maxHealth = 100;
    this.shootCooldown = 0;
    this.direction = "right";
    this.lifeStealAmount = 0;
    this.autoFire = true;
    this.pseudopods = [];
    this.nucleusPhase = 0;

    // Initialize pseudopods
    this.initPseudopods();
  },

  // Reset player (for game restart)
  reset: function () {
    this.init();
  },

  // Initialize pseudopods for animation
  initPseudopods: function () {
    // Create 5 pseudopods at different angles
    for (let i = 0; i < 5; i++) {
      this.pseudopods.push({
        angle: Math.random() * Math.PI * 2,
        length: 0.6 + Math.random() * 0.4, // 60-100% of max length
        speed: 0.02 + Math.random() * 0.03, // Animation speed
        phase: Math.random() * Math.PI * 2, // Starting phase
      });
    }
  },

  // Update player state
  update: function () {
    if (Game.gamePaused) return;

    // Decrease shoot cooldown
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    // Auto-fire bullets when cooldown is ready
    if (this.autoFire && this.shootCooldown <= 0) {
      // Use mouse/touch-directed shooting for both desktop and mobile
      Bullets.createTowardsMouse();
    }

    // Update nucleus animation
    this.nucleusPhase += 0.02;
    if (this.nucleusPhase > Math.PI * 2) {
      this.nucleusPhase -= Math.PI * 2;
    }

    // Update pseudopods animation
    for (let i = 0; i < this.pseudopods.length; i++) {
      const pod = this.pseudopods[i];
      pod.phase += pod.speed;
      if (pod.phase > Math.PI * 2) {
        pod.phase -= Math.PI * 2;
      }

      // Occasionally change pseudopod direction
      if (Math.random() < 0.01) {
        pod.angle += (Math.random() - 0.5) * 0.5;
      }
    }

    // Update player direction based on mouse or touch position
    this.updateDirectionFromMouse();

    // Only process keyboard movement if not using touch controls
    // (Input.isMobile && Input.isTouching is handled in Input.update)
    if (!(Input.isMobile && Input.isTouching)) {
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
      this.y = Math.max(
        0,
        Math.min(Game.worldSize.height - this.height, this.y)
      );
    }
  },

  // Toggle auto-fire
  toggleAutoFire: function () {
    this.autoFire = !this.autoFire;
    return this.autoFire;
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
    // Get screen coordinates using Renderer's worldToScreen method
    const screenPos = Renderer.worldToScreen(this.x, this.y);
    const screenWidth = this.width / Renderer.zoomFactor;
    const screenHeight = this.height / Renderer.zoomFactor;

    // Save context for transformations
    ctx.save();

    // Center of the white blood cell
    const centerX = screenPos.x + screenWidth / 2;
    const centerY = screenPos.y + screenHeight / 2;

    // Translate to center
    ctx.translate(centerX, centerY);

    // Draw cell membrane glow (active immune response)
    const membraneGlow = ctx.createRadialGradient(
      0,
      0,
      screenWidth * 0.4,
      0,
      0,
      screenWidth * 0.7
    );
    membraneGlow.addColorStop(0, "rgba(255, 255, 255, 0.1)");
    membraneGlow.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = membraneGlow;
    ctx.beginPath();
    ctx.arc(0, 0, screenWidth * 0.7, 0, Math.PI * 2);
    ctx.fill();

    // Draw pseudopods (extending and retracting)
    this.drawPseudopods(ctx, screenWidth);

    // Draw main cell body (slightly irregular circle)
    const time = Date.now() / 1000;
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();

    // Create slightly irregular circle for cell membrane
    const points = 12;
    const baseRadius = screenWidth * 0.4;

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      // Add slight variation to radius
      const radiusVariation = Math.sin(angle * 3 + time) * 0.05 + 0.95;
      const radius = baseRadius * radiusVariation;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.closePath();
    ctx.fill();

    // Draw cell membrane outline
    ctx.strokeStyle = "rgba(220, 220, 220, 0.8)";
    ctx.lineWidth = screenWidth * 0.03;
    ctx.stroke();

    // Draw cytoplasm texture
    this.drawCytoplasm(ctx, baseRadius);

    // Draw nucleus
    this.drawNucleus(ctx, baseRadius);

    // Draw organelles
    this.drawOrganelles(ctx, baseRadius);

    // Draw direction indicator (subtle)
    this.drawDirectionIndicator(ctx, baseRadius);

    // Restore context
    ctx.restore();

    // Draw player health bar
    const healthPercent = this.health / this.maxHealth;
    ctx.fillStyle = "#d32f2f"; // Red
    ctx.fillRect(20, Game.canvas.height - 30, 200, 20);
    ctx.fillStyle = "#4caf50"; // Green
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

  // Draw pseudopods extending from the cell
  drawPseudopods: function (ctx, cellSize) {
    const time = Date.now() / 1000;

    ctx.strokeStyle = "rgba(240, 240, 240, 0.7)";

    for (let i = 0; i < this.pseudopods.length; i++) {
      const pod = this.pseudopods[i];

      // Calculate pseudopod length with pulsating animation
      const podLength =
        cellSize * 0.3 * pod.length * (0.8 + Math.sin(pod.phase) * 0.2);
      const baseWidth = cellSize * 0.15;

      // Draw the pseudopod as a tapered line
      ctx.beginPath();
      ctx.moveTo(
        Math.cos(pod.angle) * cellSize * 0.4,
        Math.sin(pod.angle) * cellSize * 0.4
      );

      // Create control points for curved pseudopod
      const cp1x = Math.cos(pod.angle) * cellSize * 0.5;
      const cp1y = Math.sin(pod.angle) * cellSize * 0.5;
      const cp2x = Math.cos(pod.angle) * (cellSize * 0.4 + podLength * 0.7);
      const cp2y = Math.sin(pod.angle) * (cellSize * 0.4 + podLength * 0.7);
      const endX = Math.cos(pod.angle) * (cellSize * 0.4 + podLength);
      const endY = Math.sin(pod.angle) * (cellSize * 0.4 + podLength);

      // Draw the pseudopod path
      ctx.lineTo(endX, endY);

      // Set line width (tapered)
      ctx.lineWidth = baseWidth * (0.5 + Math.sin(pod.phase) * 0.5);
      ctx.stroke();

      // Draw a small bulge at the end
      ctx.fillStyle = "rgba(240, 240, 240, 0.7)";
      ctx.beginPath();
      ctx.arc(endX, endY, baseWidth * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // Draw cytoplasm texture
  drawCytoplasm: function (ctx, radius) {
    // Add some texture to the cytoplasm
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius * 0.7;
      const size = radius * (0.05 + Math.random() * 0.05);

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      ctx.fillStyle = "rgba(240, 240, 240, 0.5)";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // Draw nucleus
  drawNucleus: function (ctx, radius) {
    // Nucleus position (slightly off-center)
    const nucleusX = radius * 0.1;
    const nucleusY = radius * 0.1;
    const nucleusRadius = radius * 0.25;

    // Nucleus with slight pulsation
    const nucleusPulse = 0.95 + Math.sin(this.nucleusPhase) * 0.05;

    // Draw nucleus
    const nucleusGradient = ctx.createRadialGradient(
      nucleusX,
      nucleusY,
      0,
      nucleusX,
      nucleusY,
      nucleusRadius * nucleusPulse
    );
    nucleusGradient.addColorStop(0, "rgba(100, 100, 255, 0.9)");
    nucleusGradient.addColorStop(0.7, "rgba(70, 70, 180, 0.8)");
    nucleusGradient.addColorStop(1, "rgba(50, 50, 150, 0.7)");

    ctx.fillStyle = nucleusGradient;
    ctx.beginPath();
    ctx.arc(nucleusX, nucleusY, nucleusRadius * nucleusPulse, 0, Math.PI * 2);
    ctx.fill();

    // Draw nucleolus
    ctx.fillStyle = "rgba(50, 50, 120, 0.9)";
    ctx.beginPath();
    ctx.arc(
      nucleusX + nucleusRadius * 0.2,
      nucleusY - nucleusRadius * 0.1,
      nucleusRadius * 0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw chromatin (DNA)
    ctx.strokeStyle = "rgba(30, 30, 100, 0.7)";
    ctx.lineWidth = nucleusRadius * 0.1;

    for (let i = 0; i < 3; i++) {
      const startAngle = (i / 3) * Math.PI * 2;
      const curveRadius = nucleusRadius * 0.6;

      ctx.beginPath();
      ctx.arc(
        nucleusX,
        nucleusY,
        curveRadius,
        startAngle,
        startAngle + Math.PI * 0.5
      );
      ctx.stroke();
    }
  },

  // Draw organelles
  drawOrganelles: function (ctx, radius) {
    const time = Date.now() / 1000;

    // Draw mitochondria
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 + time * 0.1;
      const distance = radius * 0.5;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = radius * 0.15;

      // Mitochondria shape (oval with inner structure)
      ctx.fillStyle = "rgba(255, 200, 150, 0.7)";
      ctx.beginPath();
      ctx.ellipse(x, y, size, size * 0.6, angle, 0, Math.PI * 2);
      ctx.fill();

      // Inner cristae
      ctx.strokeStyle = "rgba(200, 100, 50, 0.6)";
      ctx.lineWidth = size * 0.2;

      for (let j = 0; j < 3; j++) {
        const cristaeOffset = (j - 1) * size * 0.4;
        ctx.beginPath();
        ctx.moveTo(
          x - Math.cos(angle) * size * 0.7,
          y - Math.sin(angle) * size * 0.7
        );
        ctx.lineTo(
          x + Math.cos(angle) * size * 0.7,
          y + Math.sin(angle) * size * 0.7
        );
        ctx.stroke();
      }
    }

    // Draw lysosomes (for attacking pathogens)
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.sin(time) * 0.2;
      const distance = radius * (0.2 + Math.random() * 0.3);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = radius * (0.06 + Math.random() * 0.04);

      ctx.fillStyle = "rgba(255, 100, 100, 0.8)";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // Draw direction indicator
  drawDirectionIndicator: function (ctx, radius) {
    // Determine angle based on direction
    let angle = 0;
    switch (this.direction) {
      case "right":
        angle = 0;
        break;
      case "down":
        angle = Math.PI / 2;
        break;
      case "left":
        angle = Math.PI;
        break;
      case "up":
        angle = (Math.PI * 3) / 2;
        break;
    }

    // Draw a subtle direction indicator
    const indicatorX = Math.cos(angle) * radius * 0.7;
    const indicatorY = Math.sin(angle) * radius * 0.7;

    ctx.fillStyle = "rgba(200, 255, 200, 0.8)";
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, radius * 0.1, 0, Math.PI * 2);
    ctx.fill();
  },

  /**
   * Update player direction based on mouse or touch position
   */
  updateDirectionFromMouse: function () {
    // Get player center in screen coordinates
    const playerScreenPos = Renderer.worldToScreen(
      this.x + this.width / 2,
      this.y + this.height / 2
    );

    // Determine target position based on input type
    let targetX, targetY;

    if (Input.isMobile && Input.isTouching) {
      // Use touch position for mobile
      targetX = Input.touchX;
      targetY = Input.touchY;
    } else if (!Input.isMobile) {
      // Use mouse position for desktop
      targetX = Input.mouseX;
      targetY = Input.mouseY;
    } else {
      // No valid input to determine direction
      return;
    }

    // Calculate angle to target
    const dx = targetX - playerScreenPos.x;
    const dy = targetY - playerScreenPos.y;

    // Only update if target is far enough from player to determine direction
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      // Determine direction based on angle
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal movement is dominant
        this.direction = dx > 0 ? "right" : "left";
      } else {
        // Vertical movement is dominant
        this.direction = dy > 0 ? "down" : "up";
      }
    }
  },
};
