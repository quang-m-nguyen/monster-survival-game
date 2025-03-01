#!/bin/bash

echo "Micro Defender: Vercel Deployment Helper"
echo "========================================"
echo

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Would you like to install it? (y/n)"
    read -r install_vercel
    
    if [[ $install_vercel == "y" || $install_vercel == "Y" ]]; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    else
        echo "Vercel CLI is required for deployment. Please install it manually with 'npm install -g vercel'"
        exit 1
    fi
fi

# Check if user is logged in to Vercel
echo "Checking Vercel login status..."
if ! vercel whoami &> /dev/null; then
    echo "You need to log in to Vercel first."
    vercel login
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo
echo "Deployment complete! Your game should now be live."
echo "You can view your deployments at https://vercel.com/dashboard" 