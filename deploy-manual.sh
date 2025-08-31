#!/bin/bash

# Improved deployment script
set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /home/ec2-user/ayurvedic-ecommerce

# Backup current state
echo "📦 Backing up current state..."
git stash push -m "Auto-backup before deployment $(date)"

# Pull latest changes
echo "⬇️ Pulling latest changes..."
git pull origin main

# Stop all PM2 processes
echo "🛑 Stopping PM2 processes..."
pm2 delete all || true

# Setup backend
echo "🔧 Setting up backend..."
mkdir -p backend/uploads
cp backend/sample-images/* backend/uploads/ 2>/dev/null || true
cd backend
npm install
pm2 start server.js --name "api"

# Build and serve client website
echo "🌐 Building client website..."
cd ../client-website
npm install
npm run build
rm -rf build/policies/ build/uploads/ 2>/dev/null || true
pm2 serve build 3001 --name "client" --spa

# Build and serve admin panel
echo "👨‍💼 Building admin panel..."
cd ../admin-panel
npm install
npm run build
pm2 serve build 3000 --name "admin-panel" --spa

# Reload nginx and save PM2
echo "🔄 Reloading services..."
sudo systemctl reload nginx
pm2 save

echo "✅ Deployment completed successfully!"
echo "🌐 Client: https://learnonai.com"
echo "👨‍💼 Admin: https://learnonai.com:8080"
echo "🔌 API: https://learnonai.com/api"

# Show PM2 status
pm2 list