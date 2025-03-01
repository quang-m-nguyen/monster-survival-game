# Deploying Micro Defender to Vercel

This guide provides step-by-step instructions for deploying the Micro Defender game to Vercel.

## Prerequisites

1. [Node.js](https://nodejs.org/) (v14 or later)
2. [Vercel CLI](https://vercel.com/cli) (optional for local development)
3. A [Vercel account](https://vercel.com/signup)

## Deployment Options

### Option 1: Using the Deployment Script (Recommended)

The easiest way to deploy is using the included deployment script:

1. Open a terminal in the project directory
2. Run the deployment script:
   ```
   ./deploy.sh
   ```
3. Follow the prompts to complete the deployment

### Option 2: Manual Deployment with Vercel CLI

1. Install Vercel CLI globally:
   ```
   npm install -g vercel
   ```

2. Log in to your Vercel account:
   ```
   vercel login
   ```

3. Deploy the project:
   ```
   vercel
   ```

4. For production deployment:
   ```
   vercel --prod
   ```

### Option 3: Deploy via GitHub Integration

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure your project settings (the defaults should work fine)
6. Click "Deploy"

### Option 4: Deploy via Vercel Dashboard Upload

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Choose "Upload" from the options
4. Zip your project files and upload them
5. Configure your project settings
6. Click "Deploy"

## Vercel Configuration

The project includes a `vercel.json` file that configures the deployment:

```json
{
  "version": 2,
  "builds": [
    { "src": "*.html", "use": "@vercel/static" },
    { "src": "*.css", "use": "@vercel/static" },
    { "src": "js/**/*.js", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/", "dest": "/index.html" },
    { "src": "/game", "dest": "/game.html" },
    { "src": "/(.*)", "dest": "/$1" }
  ]
}
```

This configuration ensures that:
- All HTML, CSS, and JavaScript files are properly served
- The root path (`/`) serves the index.html file
- The `/game` path serves the game.html file
- All other paths serve their corresponding files

## Custom Domains

To use a custom domain with your Vercel deployment:

1. Go to your project in the Vercel dashboard
2. Click on "Domains"
3. Add your custom domain
4. Follow the instructions to configure DNS settings

## Troubleshooting

If you encounter issues during deployment:

1. Check the Vercel deployment logs in the dashboard
2. Ensure all files are properly included in the deployment
3. Verify that the vercel.json configuration is correct
4. Check that all paths in your HTML files are relative and not absolute

For more help, refer to the [Vercel documentation](https://vercel.com/docs). 