/**
 * Renderer module for the Micro Defender Game
 * Handles all drawing operations for the game
 */
const Renderer = {
  canvas: null,
  ctx: null,
  cameraOffsetX: 0,
  cameraOffsetY: 0,
  worldSize: { width: 0, height: 0 },
  zoomFactor: 1, // Default zoom factor (1 = no zoom)
  cellTextureCache: null,
  microorganismsCache: null,

  /**
   * Initialize the renderer
   * @param {HTMLCanvasElement} canvas - The game canvas
   * @param {Object} worldSize - The size of the game world
   */
  init: function (canvas, worldSize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.worldSize = worldSize;

    // Set canvas to fill the window
    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    // Set initial zoom factor based on screen size
    this.updateZoomFactor();
  },

  /**
   * Update the zoom factor based on screen size
   */
  updateZoomFactor: function () {
    const screenWidth = window.innerWidth;

    // Apply zoom out for smaller screens
    if (screenWidth < 480) {
      // Small mobile devices - zoom out more
      this.zoomFactor = 1.5;
    } else if (screenWidth < 768) {
      // Medium mobile devices
      this.zoomFactor = 1.3;
    } else if (screenWidth < 1024) {
      // Tablets and larger phones
      this.zoomFactor = 1.15;
    } else {
      // Desktop and larger screens
      this.zoomFactor = 1;
    }

    console.log(
      `Screen width: ${screenWidth}px, Zoom factor: ${this.zoomFactor}`
    );
  },

  /**
   * Resize the canvas to fill the window
   */
  resizeCanvas: function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Update zoom factor when resizing
    this.updateZoomFactor();
  },

  /**
   * Update camera position to follow the player
   * @param {Object} player - The player object
   */
  updateCamera: function (player) {
    // Apply zoom factor to show more of the game world
    const viewportWidth = this.canvas.width * this.zoomFactor;
    const viewportHeight = this.canvas.height * this.zoomFactor;

    // Center camera on player with zoom factor applied
    this.cameraOffsetX = player.x - viewportWidth / 2 + player.width / 2;
    this.cameraOffsetY = player.y - viewportHeight / 2 + player.height / 2;

    // Keep camera within world bounds
    this.cameraOffsetX = Math.max(
      0,
      Math.min(this.worldSize.width - viewportWidth, this.cameraOffsetX)
    );
    this.cameraOffsetY = Math.max(
      0,
      Math.min(this.worldSize.height - viewportHeight, this.cameraOffsetY)
    );
  },

  /**
   * Clear the canvas
   */
  clear: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  /**
   * Draw the game ground and grid
   */
  drawGround: function () {
    // Create a biology-themed background with better contrast for green projectiles
    const ctx = this.ctx;

    // Fill with cell fluid background (changing from blue to a warmer tone)
    const fluidGradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    fluidGradient.addColorStop(0, "#3e2723"); // Dark brown
    fluidGradient.addColorStop(0.5, "#4e342e"); // Medium brown
    fluidGradient.addColorStop(1, "#5d4037"); // Light brown
    ctx.fillStyle = fluidGradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw cell texture effect (only if not already cached)
    if (!this.cellTextureCache) {
      this.createCellTextureEffect();
    }

    // Draw the cell texture with parallax effect
    const parallaxOffset = {
      x: (this.cameraOffsetX * 0.3) / this.zoomFactor,
      y: (this.cameraOffsetY * 0.3) / this.zoomFactor,
    };

    // Tile the cell texture for large worlds
    const textureSize = 800;
    const tilesX = Math.ceil(this.canvas.width / textureSize) + 1;
    const tilesY = Math.ceil(this.canvas.height / textureSize) + 1;

    const offsetX = (parallaxOffset.x % textureSize) - textureSize;
    const offsetY = (parallaxOffset.y % textureSize) - textureSize;

    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(
          this.cellTextureCache,
          offsetX + x * textureSize,
          offsetY + y * textureSize,
          textureSize,
          textureSize
        );
      }
    }
    ctx.globalAlpha = 1.0;

    // Draw floating microorganisms with parallax effect
    if (!this.microorganismsCache) {
      this.createMicroorganismsEffect();
    }

    // Draw the microorganisms with a different parallax effect
    const microParallax = {
      x: (this.cameraOffsetX * 0.1) / this.zoomFactor,
      y: (this.cameraOffsetY * 0.1) / this.zoomFactor,
    };

    const microSize = 600;
    const microTilesX = Math.ceil(this.canvas.width / microSize) + 1;
    const microTilesY = Math.ceil(this.canvas.height / microSize) + 1;

    const microOffsetX = (microParallax.x % microSize) - microSize;
    const microOffsetY = (microParallax.y % microSize) - microSize;

    for (let x = 0; x < microTilesX; x++) {
      for (let y = 0; y < microTilesY; y++) {
        ctx.globalAlpha = 0.7;
        ctx.drawImage(
          this.microorganismsCache,
          microOffsetX + x * microSize,
          microOffsetY + y * microSize,
          microSize,
          microSize
        );
      }
    }
    ctx.globalAlpha = 1.0;

    // Draw grid for visual reference (cell membrane structures)
    ctx.strokeStyle = "rgba(255, 193, 7, 0.2)"; // Amber color for grid
    ctx.lineWidth = 1;

    // Calculate grid spacing based on zoom factor
    const gridSpacing = 200;

    // Vertical grid lines
    for (let x = 0; x < this.worldSize.width; x += gridSpacing) {
      const screenX = this.worldToScreen(x, 0).x;
      if (screenX >= 0 && screenX <= this.canvas.width) {
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, this.canvas.height);
        ctx.stroke();
      }
    }

    // Horizontal grid lines
    for (let y = 0; y < this.worldSize.height; y += gridSpacing) {
      const screenY = this.worldToScreen(0, y).y;
      if (screenY >= 0 && screenY <= this.canvas.height) {
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(this.canvas.width, screenY);
        ctx.stroke();
      }
    }

    // Draw world boundaries (cell membrane)
    ctx.strokeStyle = "rgba(255, 160, 0, 0.6)"; // Orange border
    ctx.lineWidth = 3;
    ctx.strokeRect(
      -this.cameraOffsetX / this.zoomFactor,
      -this.cameraOffsetY / this.zoomFactor,
      this.worldSize.width / this.zoomFactor,
      this.worldSize.height / this.zoomFactor
    );
  },

  /**
   * Create cell texture effect for the background
   */
  createCellTextureEffect: function () {
    // Create an off-screen canvas for the cell texture
    const textureCanvas = document.createElement("canvas");
    const textureSize = 800;
    textureCanvas.width = textureSize;
    textureCanvas.height = textureSize;
    const textureCtx = textureCanvas.getContext("2d");

    // Fill with transparent background
    textureCtx.fillStyle = "rgba(0,0,0,0)";
    textureCtx.fillRect(0, 0, textureSize, textureSize);

    // Create cell membrane structures
    const numStructures = 15;
    const colors = [
      "rgba(255, 224, 178, 0.4)", // Light orange
      "rgba(255, 204, 128, 0.4)", // Orange
      "rgba(255, 183, 77, 0.4)", // Medium orange
      "rgba(255, 152, 0, 0.4)", // Dark orange
      "rgba(239, 108, 0, 0.4)", // Deep orange
    ];

    // Draw larger cell structures
    for (let i = 0; i < numStructures; i++) {
      const x = Math.random() * textureSize;
      const y = Math.random() * textureSize;
      const radius = 50 + Math.random() * 150;

      const gradient = textureCtx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, colors[i % colors.length]);
      gradient.addColorStop(0.7, colors[(i + 2) % colors.length]);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      textureCtx.fillStyle = gradient;
      textureCtx.beginPath();
      textureCtx.arc(x, y, radius, 0, Math.PI * 2);
      textureCtx.fill();

      // Add some organelle-like details inside
      const numOrganelles = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < numOrganelles; j++) {
        const orgX = x + (Math.random() * 2 - 1) * radius * 0.5;
        const orgY = y + (Math.random() * 2 - 1) * radius * 0.5;
        const orgRadius = radius * (0.1 + Math.random() * 0.2);

        textureCtx.fillStyle = "rgba(255, 143, 0, 0.5)"; // Orange organelles
        textureCtx.beginPath();
        textureCtx.arc(orgX, orgY, orgRadius, 0, Math.PI * 2);
        textureCtx.fill();
      }
    }

    // Store the texture canvas for reuse
    this.cellTextureCache = textureCanvas;
  },

  /**
   * Create microorganisms effect for the background
   */
  createMicroorganismsEffect: function () {
    // Create an off-screen canvas for the microorganisms
    const microCanvas = document.createElement("canvas");
    const microSize = 600;
    microCanvas.width = microSize;
    microCanvas.height = microSize;
    const microCtx = microCanvas.getContext("2d");

    // Fill with transparent background
    microCtx.fillStyle = "rgba(0,0,0,0)";
    microCtx.fillRect(0, 0, microSize, microSize);

    // Draw various microorganisms
    const numMicrobes = 40;

    for (let i = 0; i < numMicrobes; i++) {
      const x = Math.random() * microSize;
      const y = Math.random() * microSize;
      const size = Math.random() * 8 + 2;
      const type = Math.floor(Math.random() * 4); // 0-3 different types

      switch (type) {
        case 0: // Round bacteria
          microCtx.fillStyle = "rgba(255, 138, 101, 0.4)"; // Light red-orange
          microCtx.beginPath();
          microCtx.arc(x, y, size, 0, Math.PI * 2);
          microCtx.fill();
          break;

        case 1: // Rod-shaped bacteria
          microCtx.fillStyle = "rgba(255, 112, 67, 0.4)"; // Deep orange
          microCtx.beginPath();
          microCtx.ellipse(
            x,
            y,
            size * 2,
            size,
            Math.random() * Math.PI,
            0,
            Math.PI * 2
          );
          microCtx.fill();
          break;

        case 2: // Spiral bacteria
          microCtx.strokeStyle = "rgba(255, 202, 40, 0.5)"; // Amber
          microCtx.lineWidth = size / 2;
          microCtx.beginPath();

          // Draw a spiral
          const spiralRadius = size * 3;
          const spiralTurns = 2 + Math.random();
          const spiralPoints = 20;

          for (let j = 0; j <= spiralPoints; j++) {
            const angle = (j / spiralPoints) * Math.PI * 2 * spiralTurns;
            const radius = (j / spiralPoints) * spiralRadius;
            const spiralX = x + Math.cos(angle) * radius;
            const spiralY = y + Math.sin(angle) * radius;

            if (j === 0) {
              microCtx.moveTo(spiralX, spiralY);
            } else {
              microCtx.lineTo(spiralX, spiralY);
            }
          }

          microCtx.stroke();
          break;

        case 3: // Amoeba-like
          microCtx.fillStyle = "rgba(255, 171, 64, 0.3)"; // Orange
          microCtx.beginPath();

          // Create a blob shape with random bumps
          const blobRadius = size * 2;
          const blobPoints = 8;

          for (let j = 0; j <= blobPoints; j++) {
            const angle = (j / blobPoints) * Math.PI * 2;
            const radius = blobRadius * (0.7 + Math.random() * 0.6);
            const blobX = x + Math.cos(angle) * radius;
            const blobY = y + Math.sin(angle) * radius;

            if (j === 0) {
              microCtx.moveTo(blobX, blobY);
            } else {
              microCtx.bezierCurveTo(
                x + Math.cos(angle - Math.PI / blobPoints) * radius * 1.2,
                y + Math.sin(angle - Math.PI / blobPoints) * radius * 1.2,
                x + Math.cos(angle) * radius * 1.2,
                y + Math.sin(angle) * radius * 1.2,
                blobX,
                blobY
              );
            }
          }

          microCtx.closePath();
          microCtx.fill();
          break;
      }
    }

    // Store the microorganisms canvas for reuse
    this.microorganismsCache = microCanvas;
  },

  /**
   * Draw the HUD (Heads-Up Display)
   * @param {Object} player - The player object
   * @param {number} score - The current score
   * @param {boolean} gameOver - Whether the game is over
   */
  drawHUD: function (player, score, gameOver) {
    // Draw player health bar
    const healthPercent = player.health / player.maxHealth;
    this.ctx.fillStyle = "#d32f2f"; // Red
    this.ctx.fillRect(20, this.canvas.height - 30, 200, 20);
    this.ctx.fillStyle = "#4caf50"; // Green
    this.ctx.fillRect(20, this.canvas.height - 30, 200 * healthPercent, 20);
    this.ctx.strokeStyle = "#fff";
    this.ctx.strokeRect(20, this.canvas.height - 30, 200, 20);

    // Draw health value
    this.ctx.fillStyle = "white";
    this.ctx.font = "16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      Math.ceil(player.health) + "/" + player.maxHealth,
      120,
      this.canvas.height - 15
    );

    // Draw score - moved to be with level info
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "left";
    this.ctx.fillText("Score: " + score, 20, 60);

    // Draw game over message
    if (gameOver) {
      this.drawGameOver(score);
    }
  },

  /**
   * Draw the game over screen
   * @param {number} score - The final score
   * @param {number} level - The final level
   */
  drawGameOver: function (score, level) {
    this.ctx.fillStyle = "rgba(0, 77, 64, 0.7)"; // Dark teal with opacity
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "white";
    this.ctx.font = "48px Arial";
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      "GAME OVER",
      this.canvas.width / 2,
      this.canvas.height / 2 - 50
    );

    this.ctx.font = "24px Arial";
    this.ctx.fillText(
      "Score: " + score,
      this.canvas.width / 2,
      this.canvas.height / 2
    );
    this.ctx.fillText(
      "Level: " + level,
      this.canvas.width / 2,
      this.canvas.height / 2 + 30
    );
    this.ctx.fillText(
      "Press R to restart",
      this.canvas.width / 2,
      this.canvas.height / 2 + 90
    );
  },

  /**
   * Convert world coordinates to screen coordinates
   * @param {number} x - World x coordinate
   * @param {number} y - World y coordinate
   * @returns {Object} Screen coordinates {x, y}
   */
  worldToScreen: function (x, y) {
    return {
      x: (x - this.cameraOffsetX) / this.zoomFactor,
      y: (y - this.cameraOffsetY) / this.zoomFactor,
    };
  },

  /**
   * Convert screen coordinates to world coordinates
   * @param {number} x - Screen x coordinate
   * @param {number} y - Screen y coordinate
   * @returns {Object} World coordinates {x, y}
   */
  screenToWorld: function (x, y) {
    return {
      x: x * this.zoomFactor + this.cameraOffsetX,
      y: y * this.zoomFactor + this.cameraOffsetY,
    };
  },
};
