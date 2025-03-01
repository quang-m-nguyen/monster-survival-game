# Monster Survival Game

A top-down survival game where you fight off endless waves of monsters while leveling up and upgrading your weapons.

## Game Features

- Free movement in all directions
- Automatic shooting in four directions (up, down, left, right)
- Toggle auto-fire on/off
- Adjustable game speed (normal or 50% slower)
- Monster spawning from all sides
- Level-up system with weapon upgrades
- Player and bullet size increases with level
- Health system with life steal ability
- Score tracking
- Game over and restart functionality
- Responsive design with mobile touch controls
- Dynamic camera scaling for different screen sizes

## Controls

### Desktop Controls
- **WASD or Arrow Keys**: Move the player
- **Auto-fire**: Automatically shoots in the current direction
- **F**: Toggle auto-fire on/off
- **G**: Toggle game speed between normal and 50% (50% slower)
- **Space**: Shoot manually (even with auto-fire on)
- **1, 2, 3, 4**: Select upgrade option when available
- **Mouse**: Click on upgrade icons to apply upgrades
- **R**: Restart the game when game over

### Mobile Controls
- **Tap and Hold**: Tap anywhere on the screen to move the player toward that location
- **Auto-fire**: Automatically shoots in the direction of movement
- **Tap Upgrade Icons**: Tap on upgrade icons to apply upgrades
- **Tap Screen**: Tap the screen when game over to restart

## Mobile Optimization

The game automatically detects mobile devices and enables:
- Touch controls for intuitive movement
- Zoomed-out camera view to see more of the game world
- Properly scaled UI elements for different screen sizes
- Visual target indicator showing where the player is moving to
- Responsive upgrade panel that adapts to screen size

## Level Progression

As you level up:
- Your character and bullets grow in size (up to 2x the original size)
- You gain more health and slightly increased speed
- You can choose from four different upgrades
- Monsters become faster and more challenging

The game features a balanced progression system:

### Monster Requirements
- **Early Game (Levels 1-5)**: Easy progression with 1-2 monsters per level
- **Mid Game (Levels 6-10)**: Gradual increase from 3-5 monsters
- **Late Game (Levels 11-20)**: Moderate increase from 6-10 monsters
- **End Game (Level 21+)**: More significant scaling to prevent excessive leveling

### Monster Difficulty
The game implements a diminishing returns system for monster speed:
- **Early Levels**: Normal speed increases
- **Mid Levels**: Slightly reduced speed increases
- **Higher Levels**: Minimal speed increases

This creates a challenging but fair experience that remains playable even at higher levels.

## Weapon Upgrade System

When you level up, upgrade options appear in the bottom-left corner of the screen. You can continue playing and apply upgrades whenever you want by pressing the corresponding number key or clicking/tapping on the icon. Upgrades will stack if not used immediately.

Available upgrades:

1. **Attack Speed**: Decreases the cooldown between shots
2. **Attack Damage**: Increases the damage dealt by each bullet
3. **Life Steal**: Increases health recovery when killing monsters
4. **Multi-Shot**: Adds an additional bullet stream, allowing you to fire in multiple directions simultaneously

## Project Structure

The game is built with a modular JavaScript architecture:

- **game.js**: Main game module that initializes and coordinates all other modules
- **renderer.js**: Handles all drawing operations and camera management
- **player.js**: Manages player state, movement, and rendering
- **bullets.js**: Handles bullet creation, movement, and collision detection
- **monsters.js**: Controls monster spawning, movement, and behavior
- **levelSystem.js**: Manages player progression, level-ups, and weapon upgrades
- **input.js**: Processes keyboard and touch input for game controls

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
- Local high score storage
- Customizable controls 