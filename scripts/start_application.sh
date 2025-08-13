#!/bin/bash
cd /home/ec2-user/ayurvedic-ecommerce

# Install dependencies and build
echo "Installing dependencies..."
cd backend && npm install
cd ../admin-panel && npm install && npm run build
cd ../client-website && npm install && npm run build

# Stop existing processes
echo "Stopping existing processes..."
pm2 delete all 2>/dev/null || true

# Start all services
echo "Starting services..."
cd backend
pm2 start server.js --name "api"

cd ../admin-panel
pm2 serve build 3000 --name "admin" --spa

cd ../client-website
pm2 serve build 3001 --name "client" --spa

# Copy nginx config
echo "Updating nginx config..."
sudo cp ../nginx.conf /etc/nginx/sites-available/learnonai.com
sudo ln -sf /etc/nginx/sites-available/learnonai.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

pm2 save
echo "All services started!"