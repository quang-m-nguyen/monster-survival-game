# Micro Defender: Immune Response

A browser-based game where you control a white blood cell defending the body against pathogens.

## Game Overview

Control a powerful white blood cell as it navigates through the body's fluid environment, battling harmful pathogens while producing antibodies to neutralize the infection.

### How to Play

- **Movement (Desktop):** Use arrow keys or WASD to move your white blood cell
- **Movement (Mobile):** Tap anywhere on the screen to move in that direction
- **Antibody Production:** Automatic! Your white blood cell produces antibodies in the direction you're facing
- **Toggle Auto-production:** Press F to toggle automatic antibody production on/off
- **Cellular Response Speed:** Press G to toggle between normal speed and 50% speed (50% slower)
- **Manual Antibody Release:** Press spacebar to release antibodies manually (even with auto-production on)
- **Goal:** Survive as long as possible and strengthen your immune response
- **Immune Adaptation:** Neutralize pathogens to level up and choose immune system upgrades
- **Cell Growth:** Your white blood cell and antibodies become more effective as you level up!
- **Immune Upgrades:** When available, press 1-4 or click/tap upgrade icons to apply upgrades
- **Multi-directional Response:** Upgrade to release antibodies in multiple directions at once!
- **Mobile Controls:** The game automatically detects mobile devices and enables touch controls
- **Restart (Mobile):** Tap the screen when game over to restart

## Deployment

This game can be easily deployed to Vercel. Follow these steps:

### Prerequisites

1. [Node.js](https://nodejs.org/) (v14 or later)
2. [Vercel CLI](https://vercel.com/cli) (optional for local development)
3. A [Vercel account](https://vercel.com/signup)

### Deploying to Vercel

#### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the project:
   ```
   vercel
   ```

4. Follow the prompts to complete the deployment.

#### Option 2: Deploy via GitHub Integration

1. Push your code to a GitHub repository.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard).
3. Click "New Project".
4. Import your GitHub repository.
5. Configure your project settings (the defaults should work fine).
6. Click "Deploy".

#### Option 3: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click "New Project".
3. Choose "Upload" from the options.
4. Zip your project files and upload them.
5. Configure your project settings.
6. Click "Deploy".

## Local Development

To run the game locally:

1. Clone this repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## License

MIT 