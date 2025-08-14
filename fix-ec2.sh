#!/bin/bash

echo "🔧 Fixing EC2 services..."

cd /home/ubuntu/ayurvedic-ecommerce

# Stop all PM2 processes
echo "Stopping all services..."
pm2 delete all 2>/dev/null || true

# Kill any processes on ports
echo "Killing processes on ports..."
sudo lsof -ti:5000 | xargs kill -9 2>/dev/null || true
sudo lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sudo lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Install dependencies and build
echo "Installing dependencies..."
cd backend && npm install
cd ../admin-panel && npm install && npm run build
cd ../client-website && npm install && npm run build

# Start services
echo "Starting services..."
cd /home/ubuntu/ayurvedic-ecommerce/backend
pm2 start server.js --name "api"

cd /home/ubuntu/ayurvedic-ecommerce/client-website
pm2 serve build 3001 --name "client" --spa

# Copy nginx config and restart
echo "Updating nginx..."
sudo cp /home/ubuntu/ayurvedic-ecommerce/nginx.conf /etc/nginx/sites-available/learnonai.com
sudo ln -sf /etc/nginx/sites-available/learnonai.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

pm2 save

echo "✅ Services fixed!"
echo "🌐 URLs:"
echo "   Client:  https://learnonai.com"
echo "   Admin:   https://learnonai.com/admin"
echo "   API:     https://learnonai.com/api"