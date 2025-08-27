#!/bin/bash

# Navigate to project directory
cd /home/ec2-user/ayurvedic-ecommerce

# Stash and pull latest changes
git stash
git pull origin main

# Stop all PM2 processes
pm2 delete all

# Setup backend
mkdir -p backend/uploads
cp backend/sample-images/* backend/uploads/
cd backend
npm install

# Set PhonePe environment variables and start backend
export PHONEPE_MERCHANT_ID="SU2508241910194031786811"
export PHONEPE_SALT_KEY="11d250e2-bd67-43b9-bc80-d45b3253566b"
export NODE_ENV="production"
pm2 start server.js --name "api"

# Build and serve client website
cd ../client-website
npm install
npm run build
rm -rf build/policies/ build/uploads/
pm2 serve build 3001 --name "client" --spa

# Build and serve admin panel
cd ../admin-panel
npm install
npm run build
pm2 serve build 3000 --name "admin-panel" --spa

# Reload nginx and save PM2 config
sudo systemctl reload nginx
pm2 save

echo "✅ Deployment complete with PhonePe credentials configured"
