# Monster Survival Game

A top-down survival game where you fight off endless waves of monsters while leveling up and upgrading your weapons.

## Game Features

- Free movement in all directions
- Shooting in four directions (up, down, left, right)
- Monster spawning from all sides
- Level-up system with weapon upgrades
- Health system with life steal ability
- Score tracking
- Game over and restart functionality

## Controls

- **WASD or Arrow Keys**: Move the player
- **Space**: Shoot in the current direction
- **1, 2, 3**: Select upgrade option when leveling up
- **R**: Restart the game when game over

## Project Structure

The game is built with a modular JavaScript architecture:

- **game.js**: Main game module that initializes and coordinates all other modules
- **renderer.js**: Handles all drawing operations and camera management
- **player.js**: Manages player state, movement, and rendering
- **bullets.js**: Handles bullet creation, movement, and collision detection
- **monsters.js**: Controls monster spawning, movement, and behavior
- **levelSystem.js**: Manages player progression, level-ups, and weapon upgrades
- **input.js**: Processes keyboard input for game controls

## Weapon Upgrade System

When you level up, you can choose from the following upgrades:

1. **Attack Speed**: Decreases the cooldown between shots
2. **Attack Damage**: Increases the damage dealt by each bullet
3. **Life Steal**: Increases health recovery when killing monsters

## Development

This game is built using vanilla JavaScript and HTML5 Canvas, with no external dependencies.

To run the game locally:

1. Clone the repository
2. Open index.html in your browser
3. Click "Play" to start the game

## Future Enhancements

- Additional weapon types
- More monster varieties
- Power-ups and special abilities
- Mobile touch controls
- Local high score storage 