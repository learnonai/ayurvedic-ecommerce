#!/bin/bash
# Manual deployment script for EC2

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /home/ec2-user/ayurvedic-ecommerce

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Setup sample images for production
echo "🖼️ Setting up sample images..."
mkdir -p backend/uploads
cp backend/sample-images/* backend/uploads/ 2>/dev/null || echo "No sample images found"

# Install dependencies and build
echo "📦 Installing dependencies..."
cd backend && npm install
cd ../admin-panel && npm install && npm run build
cd ../client-website && npm install && npm run build

# Stop existing processes
echo "🛑 Stopping existing processes..."
pm2 delete all 2>/dev/null || true

# Start backend API
echo "🔧 Starting backend API..."
cd /home/ec2-user/ayurvedic-ecommerce/backend
pm2 start server.js --name "api"

# Start client website
echo "🌐 Starting client website..."
cd /home/ec2-user/ayurvedic-ecommerce/client-website
pm2 serve build 3001 --name "client" --spa

# Update nginx config
echo "⚙️ Updating nginx config..."
sudo cp /home/ec2-user/ayurvedic-ecommerce/nginx.conf /etc/nginx/conf.d/learnonai.conf
sudo nginx -t && sudo systemctl reload nginx

# Save PM2 processes
pm2 save

echo "✅ Deployment complete!"
echo "🌐 Client: https://learnonai.com"
echo "👨‍💼 Admin: https://learnonai.com:8080"
echo "🔧 API: https://learnonai.com/api"