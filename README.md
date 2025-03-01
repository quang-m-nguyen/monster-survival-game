# Cosmic Defender: Space Survival

A fast-paced space survival game where you pilot an advanced spacecraft through the cosmic void, battling alien creatures while collecting upgrades to enhance your combat capabilities.

## Game Features

- **Immersive Sci-Fi Visuals**: Space-themed background with stars and nebula effects, futuristic spacecraft with shield and thruster animations, energy projectiles with glowing trails, and animated alien creatures.
- **Responsive Controls**: Smooth keyboard controls for desktop and intuitive touch controls for mobile devices.
- **Progressive Difficulty**: Aliens become stronger and more numerous as you survive longer.
- **Weapon Upgrade System**: Collect upgrades to enhance your spacecraft's firepower, speed, and defenses.
- **Score Tracking**: Keep track of your high score and try to beat it.
- **Mobile Optimization**: Automatically detects mobile devices and enables touch controls.
- **Adjustable game speed**: Toggle between normal and 50% slower speed.

## Controls

- **Movement (Desktop)**: Arrow keys or WASD to move the spacecraft
- **Shooting (Desktop)**: Automatically shoots in the direction of movement
- **Restart (Desktop)**: Press R to restart when game over
- **Game Speed (Desktop)**: Press G to toggle game speed between normal and 50% (50% slower)

## Mobile Controls

- **Tap and Hold**: Tap anywhere on the screen to move the player toward that location
- **Auto-fire**: Automatically shoots in the direction of movement
- **Tap Upgrade Icons**: Tap on upgrade icons to apply upgrades
- **Tap Screen**: Tap the screen when game over to restart

## Mobile Optimization

The game automatically detects mobile devices and enables:
- Touch controls for intuitive gameplay
- Zoomed-out camera view for better visibility
- Properly scaled UI elements
- Visual target indicator showing where you're moving
- Responsive upgrade panel

## Level Progression

As you survive longer:
1. Aliens spawn more frequently
2. Aliens become faster and more resilient
3. Special larger aliens appear with more health
4. Score multiplier increases

## Weapon Upgrade System

Collect upgrades that appear randomly to enhance your spacecraft:
- **Damage**: Increases the damage of your energy projectiles
- **Fire Rate**: Increases how quickly you can fire
- **Speed**: Increases your movement speed
- **Health**: Restores and increases your maximum health
- **Life Steal**: Gain health when defeating aliens

## Project Structure

- **index.html**: Main entry point with game description and instructions
- **game.html**: The game canvas and loading of game scripts
- **styles.css**: Basic styling for the HTML pages
- **js/game.js**: Main game loop and initialization
- **js/player.js**: Player spacecraft logic and rendering
- **js/bullets.js**: Projectile management and collision detection
- **js/monsters.js**: Alien creature spawning and behavior
- **js/upgrades.js**: Upgrade system implementation
- **js/input.js**: Processes keyboard and touch input for game controls
- **js/renderer.js**: Handles drawing operations and camera management
- **js/ui.js**: User interface elements like health bar and score display

## Development

To run the game locally:
1. Clone this repository
2. Open index.html in a web browser
3. Click "Play Game" to start

No build process or dependencies required - pure JavaScript, HTML and CSS.

## Future Enhancements

- Additional spacecraft types with unique abilities
- More alien varieties with different attack patterns
- Power-up system with temporary special abilities
- Boss battles at milestone scores
- Local multiplayer support 