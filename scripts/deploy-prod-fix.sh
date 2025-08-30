#!/bin/bash

# Production deployment fix - individual node_modules
set -e

echo "🚀 Deploying with individual node_modules for production..."

# Stop services
pm2 delete all || true

# Backend
echo "🔧 Backend setup..."
cd /home/ec2-user/ayurvedic-ecommerce/backend
npm install
mkdir -p uploads
cp sample-images/* uploads/ 2>/dev/null || true
pm2 start server.js --name "api"

# Client website
echo "🌐 Client website setup..."
cd ../client-website
npm install
npm run build
pm2 serve build 3001 --name "client" --spa

# Admin panel
echo "👨💼 Admin panel setup..."
cd ../admin-panel
npm install
npm run build
pm2 serve build 3000 --name "admin-panel" --spa

# Reload nginx and save
sudo systemctl reload nginx
pm2 save

echo "✅ Production deployment complete!"
pm2 list