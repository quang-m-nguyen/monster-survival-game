/**
 * Pathogens module for the Micro Defender Game
 */

const Monsters = {
  list: [],

  // Pathogen settings
  settings: {
    width: 30,
    height: 30,
    originalWidth: 30, // Store original width for reset
    originalHeight: 30, // Store original height for reset
    speed: 2,
    color: "#e57373", // Base color for pathogens
    spawnRate: 60, // Frames between spawns
    maxHealth: 30,
    damage: 10, // Damage to player on collision
  },

  // Pathogen types
  types: [
    {
      name: "bacteria",
      variant: "cocci", // Round bacteria
      color: "#e57373", // Red
      speedMultiplier: 1,
      sizeMultiplier: 1,
      healthMultiplier: 1,
      damageMultiplier: 1,
    },
    {
      name: "bacteria",
      variant: "bacilli", // Rod-shaped bacteria
      color: "#9575cd", // Purple
      speedMultiplier: 0.8,
      sizeMultiplier: 1.2,
      healthMultiplier: 1.5,
      damageMultiplier: 1.2,
    },
    {
      name: "bacteria",
      variant: "spirilla", // Spiral bacteria
      color: "#4fc3f7", // Blue
      speedMultiplier: 1.3,
      sizeMultiplier: 0.9,
      healthMultiplier: 0.8,
      damageMultiplier: 0.9,
    },
    {
      name: "virus",
      variant: "bacteriophage", // T4 bacteriophage
      color: "#81c784", // Green
      speedMultiplier: 0.7,
      sizeMultiplier: 0.8,
      healthMultiplier: 2,
      damageMultiplier: 1.5,
    },
    {
      name: "virus",
      variant: "coronavirus", // Coronavirus-like
      color: "#ffb74d", // Orange
      speedMultiplier: 1.1,
      sizeMultiplier: 1.1,
      healthMultiplier: 1.2,
      damageMultiplier: 1.3,
    },
  ],

  // Initialize pathogens
  init: function () {
    this.list = [];
    // Reset pathogen size to original
    this.settings.width = this.settings.originalWidth;
    this.settings.height = this.settings.originalHeight;
  },

  // Create a new pathogen
  create: function () {
    // Select a random pathogen type based on level
    const availableTypes = Math.min(
      this.types.length,
      Math.ceil(LevelSystem.currentLevel / 2)
    );
    const typeIndex = Math.floor(Math.random() * availableTypes);
    const type = this.types[typeIndex];

    console.log(
      `Creating pathogen: ${type.name} (${type.variant}), Available types: ${availableTypes}`
    );

    // Determine spawn position (outside the screen)
    const spawnSide = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;

    switch (spawnSide) {
      case 0: // top
        x = Math.random() * Game.worldSize.width;
        y = -this.settings.height;
        break;
      case 1: // right
        x = Game.worldSize.width + this.settings.width;
        y = Math.random() * Game.worldSize.height;
        break;
      case 2: // bottom
        x = Math.random() * Game.worldSize.width;
        y = Game.worldSize.height + this.settings.height;
        break;
      case 3: // left
        x = -this.settings.width;
        y = Math.random() * Game.worldSize.height;
        break;
    }

    // Calculate size based on type
    const width = this.settings.width * type.sizeMultiplier;
    const height = this.settings.height * type.sizeMultiplier;

    // Calculate health based on type and level
    const health =
      this.settings.maxHealth *
      type.healthMultiplier *
      (1 + (LevelSystem.currentLevel - 1) * 0.2);

    // Create the pathogen
    const newPathogen = {
      x,
      y,
      width,
      height,
      type: type,
      health,
      maxHealth: health,
      speed: this.settings.speed * type.speedMultiplier,
      damage: this.settings.damage * type.damageMultiplier,
      // Animation properties
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      pulsePhase: Math.random() * Math.PI * 2,
      flagellaPhase: Math.random() * Math.PI * 2,
      spikePhase: Math.random() * Math.PI * 2,
      wobble: 0,
    };

    this.list.push(newPathogen);
    console.log(
      `Pathogen created at (${x.toFixed(0)}, ${y.toFixed(
        0
      )}), Total pathogens: ${this.list.length}`
    );

    return newPathogen;
  },

  // Update all pathogens
  update: function () {
    if (Game.gamePaused) return;

    // Create new pathogens based on spawn rate and level
    const spawnRate = Math.max(
      5,
      this.settings.spawnRate - LevelSystem.currentLevel * 2
    );

    // Debug logging
    if (Game.frameCount % 60 === 0) {
      console.log(
        `Monsters update - Frame: ${Game.frameCount}, Spawn Rate: ${spawnRate}, Current pathogens: ${this.list.length}`
      );
    }

    if (Game.frameCount % spawnRate === 0) {
      console.log(`Spawning new pathogen at frame ${Game.frameCount}`);
      this.create();
    }

    for (let i = 0; i < this.list.length; i++) {
      const pathogen = this.list[i];

      // Update animation properties
      pathogen.rotation += pathogen.rotationSpeed * Game.gameSpeedMultiplier;
      pathogen.pulsePhase += 0.05 * Game.gameSpeedMultiplier;
      pathogen.flagellaPhase += 0.1 * Game.gameSpeedMultiplier;
      pathogen.spikePhase += 0.03 * Game.gameSpeedMultiplier;
      pathogen.wobble = Math.sin(pathogen.pulsePhase) * 0.2;

      // Calculate direction to player
      const dx =
        Player.x + Player.width / 2 - (pathogen.x + pathogen.width / 2);
      const dy =
        Player.y + Player.height / 2 - (pathogen.y + pathogen.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Normalize direction
      const dirX = dx / distance;
      const dirY = dy / distance;

      // Add some randomness to movement (more for bacteria, less for viruses)
      let randomFactor = 0.3;
      if (pathogen.type.name === "virus") {
        randomFactor = 0.1; // Viruses are more directed
      }

      const randX = (Math.random() - 0.5) * randomFactor;
      const randY = (Math.random() - 0.5) * randomFactor;

      // Move pathogen towards player with some randomness
      pathogen.x += (dirX + randX) * pathogen.speed * Game.gameSpeedMultiplier;
      pathogen.y += (dirY + randY) * pathogen.speed * Game.gameSpeedMultiplier;

      // Check for collision with player
      if (Game.checkCollision(pathogen, Player)) {
        // Damage player
        Player.health -= pathogen.damage;

        // Remove pathogen
        this.list.splice(i, 1);
        i--;

        // Check if player is dead
        if (Player.health <= 0) {
          Game.endGame();
        }

        continue;
      }
    }
  },

  // Draw all pathogens
  draw: function (ctx) {
    if (this.list.length === 0 && Game.frameCount > 120) {
      console.log("No pathogens to draw. Frame count:", Game.frameCount);
    }

    this.list.forEach((pathogen) => {
      // Convert world position to screen position
      const screenPos = Renderer.worldToScreen(pathogen.x, pathogen.y);

      // Check if pathogen is visible on screen
      if (
        screenPos.x + pathogen.width / Renderer.zoomFactor >= 0 &&
        screenPos.x - pathogen.width / Renderer.zoomFactor <=
          Renderer.canvas.width &&
        screenPos.y + pathogen.height / Renderer.zoomFactor >= 0 &&
        screenPos.y - pathogen.height / Renderer.zoomFactor <=
          Renderer.canvas.height
      ) {
        // Save context state
        ctx.save();

        // Translate to pathogen position
        ctx.translate(screenPos.x, screenPos.y);

        // Rotate pathogen
        ctx.rotate(pathogen.rotation);

        // Draw pathogen based on type
        if (pathogen.type.name === "bacteria") {
          this.drawBacteria(
            ctx,
            pathogen.width / Renderer.zoomFactor,
            pathogen.height / Renderer.zoomFactor,
            pathogen
          );
        } else if (pathogen.type.name === "virus") {
          this.drawVirus(
            ctx,
            pathogen.width / Renderer.zoomFactor,
            pathogen.height / Renderer.zoomFactor,
            pathogen
          );
        }

        // Restore context state
        ctx.restore();

        // Draw health bar above pathogen
        const healthBarWidth = pathogen.width / Renderer.zoomFactor;
        const healthBarHeight = 4;
        const healthPercentage = pathogen.health / pathogen.maxHealth;

        // Health bar background
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(
          screenPos.x - healthBarWidth / 2,
          screenPos.y -
            pathogen.height / (2 * Renderer.zoomFactor) -
            healthBarHeight -
            2,
          healthBarWidth,
          healthBarHeight
        );

        // Health bar
        ctx.fillStyle = `rgb(${255 - healthPercentage * 255}, ${
          healthPercentage * 255
        }, 0)`;
        ctx.fillRect(
          screenPos.x - healthBarWidth / 2,
          screenPos.y -
            pathogen.height / (2 * Renderer.zoomFactor) -
            healthBarHeight -
            2,
          healthBarWidth * healthPercentage,
          healthBarHeight
        );
      }
    });
  },

  // Draw bacteria
  drawBacteria: function (ctx, width, height, pathogen) {
    const baseSize = Math.max(width, height);
    const variant = pathogen.type.variant;
    const color = pathogen.type.color;
    const pulse = 1 + pathogen.wobble;

    // Create gradient for the bacteria
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, baseSize / 2);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, color);
    gradient.addColorStop(
      1,
      `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
        color.slice(3, 5),
        16
      )}, ${parseInt(color.slice(5, 7), 16)}, 0.5)`
    );

    ctx.fillStyle = gradient;

    // Draw based on bacteria variant
    if (variant === "cocci") {
      // Round bacteria
      ctx.beginPath();
      ctx.arc(0, 0, (baseSize / 2) * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Draw cell details
      ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
      for (let i = 0; i < 5; i++) {
        const angle = Math.PI * 2 * (i / 5) + pathogen.pulsePhase;
        const x = (Math.cos(angle) * baseSize) / 4;
        const y = (Math.sin(angle) * baseSize) / 4;
        const size =
          (baseSize / 10) * (0.7 + Math.sin(pathogen.pulsePhase + i) * 0.3);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (variant === "bacilli") {
      // Rod-shaped bacteria
      const rodLength = baseSize * 1.5;
      const rodWidth = baseSize * 0.6;

      // Draw rod shape
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        (rodLength / 2) * pulse,
        (rodWidth / 2) * pulse,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw cell details
      ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
      for (let i = 0; i < 3; i++) {
        const x = ((i - 1) * rodLength) / 3;
        const size =
          (baseSize / 10) * (0.7 + Math.sin(pathogen.pulsePhase + i) * 0.3);

        ctx.beginPath();
        ctx.arc(x, 0, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw flagella (tail-like structures)
      ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
      ctx.lineWidth = 1;

      // Draw flagella at both ends
      for (let end = -1; end <= 1; end += 2) {
        const startX = (end * rodLength) / 2;

        ctx.beginPath();
        ctx.moveTo(startX, 0);

        // Draw wavy flagella
        for (let i = 1; i <= 10; i++) {
          const x = startX + end * i * 3;
          const y = Math.sin(pathogen.flagellaPhase + i * 0.5) * 5;
          ctx.lineTo(x, y);
        }

        ctx.stroke();
      }
    } else if (variant === "spirilla") {
      // Spiral bacteria
      ctx.lineWidth = (baseSize / 4) * pulse;
      ctx.strokeStyle = color;

      // Draw spiral shape
      ctx.beginPath();

      // Create a spiral with 3 turns
      const turns = 3;
      const points = 20;
      const radius = baseSize / 2;

      for (let i = 0; i <= points; i++) {
        const t = i / points;
        const angle = turns * Math.PI * 2 * t;
        const spiralRadius = radius * t;
        const x = Math.cos(angle) * spiralRadius;
        const y = Math.sin(angle) * spiralRadius;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();

      // Draw flagella at the end of the spiral
      ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
      ctx.lineWidth = 1;

      const endX = Math.cos(turns * Math.PI * 2) * radius;
      const endY = Math.sin(turns * Math.PI * 2) * radius;

      ctx.beginPath();
      ctx.moveTo(endX, endY);

      // Draw wavy flagella
      for (let i = 1; i <= 10; i++) {
        const angle = turns * Math.PI * 2 + i * 0.2;
        const x = endX + Math.cos(angle) * i * 3;
        const y =
          endY +
          Math.sin(angle) * i * 3 +
          Math.sin(pathogen.flagellaPhase + i * 0.5) * 3;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  },

  // Draw virus
  drawVirus: function (ctx, width, height, pathogen) {
    const baseSize = Math.max(width, height);
    const variant = pathogen.type.variant;
    const color = pathogen.type.color;
    const pulse = 1 + pathogen.wobble;

    if (variant === "bacteriophage") {
      // T4 bacteriophage (complex virus with head and tail)
      // Draw head (capsid)
      const headSize = baseSize * 0.4;
      ctx.fillStyle = color;

      // Hexagonal head
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = Math.cos(angle) * headSize * pulse;
        const y = Math.sin(angle) * headSize * pulse;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();

      // Draw tail (cylindrical structure)
      const tailLength = baseSize * 0.8;
      const tailWidth = baseSize * 0.1;

      ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
        color.slice(3, 5),
        16
      )}, ${parseInt(color.slice(5, 7), 16)}, 0.8)`;
      ctx.fillRect(-tailWidth / 2, 0, tailWidth, tailLength);

      // Draw tail fibers
      ctx.strokeStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
        color.slice(3, 5),
        16
      )}, ${parseInt(color.slice(5, 7), 16)}, 0.6)`;
      ctx.lineWidth = 1;

      // Draw 6 tail fibers
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + pathogen.spikePhase;
        const startY = tailLength;

        ctx.beginPath();
        ctx.moveTo(0, startY);

        // Create curved tail fibers
        const endX = Math.cos(angle) * baseSize * 0.4;
        const endY = startY + Math.sin(angle) * baseSize * 0.2;

        // Control points for curve
        const cp1x = Math.cos(angle) * baseSize * 0.2;
        const cp1y = startY + Math.sin(angle) * baseSize * 0.1;

        ctx.quadraticCurveTo(cp1x, cp1y, endX, endY);
        ctx.stroke();
      }

      // Draw base plate
      ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
        color.slice(3, 5),
        16
      )}, ${parseInt(color.slice(5, 7), 16)}, 0.9)`;
      ctx.beginPath();
      ctx.arc(0, tailLength, tailWidth, 0, Math.PI * 2);
      ctx.fill();
    } else if (variant === "coronavirus") {
      // Coronavirus-like virus with spikes
      // Draw main body
      const bodySize = baseSize * 0.4 * pulse;

      // Create gradient for the virus body
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, bodySize);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.7, color);
      gradient.addColorStop(
        1,
        `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
          color.slice(3, 5),
          16
        )}, ${parseInt(color.slice(5, 7), 16)}, 0.5)`
      );

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, bodySize, 0, Math.PI * 2);
      ctx.fill();

      // Draw spikes (characteristic of coronavirus)
      const spikeCount = 16;
      const spikeLength = baseSize * 0.25;
      const spikeWidth = baseSize * 0.08;

      ctx.fillStyle = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
        color.slice(3, 5),
        16
      )}, ${parseInt(color.slice(5, 7), 16)}, 0.9)`;

      for (let i = 0; i < spikeCount; i++) {
        const angle = Math.PI * 2 * (i / spikeCount) + pathogen.spikePhase;
        const x = Math.cos(angle) * bodySize;
        const y = Math.sin(angle) * bodySize;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        // Draw club-shaped spike
        ctx.beginPath();
        ctx.moveTo(0, -spikeWidth / 2);
        ctx.lineTo(spikeLength * 0.7, -spikeWidth / 2);
        ctx.arc(
          spikeLength * 0.7,
          0,
          spikeWidth / 2,
          -Math.PI / 2,
          Math.PI / 2
        );
        ctx.lineTo(0, spikeWidth / 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // Draw internal structures
      ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
      for (let i = 0; i < 4; i++) {
        const angle = Math.PI * 2 * (i / 4) + pathogen.pulsePhase;
        const distance = bodySize * 0.5;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const size =
          baseSize * 0.1 * (0.7 + Math.sin(pathogen.pulsePhase + i) * 0.3);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
};
