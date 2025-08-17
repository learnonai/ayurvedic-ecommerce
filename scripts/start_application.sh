#!/bin/bash
cd /home/ec2-user/ayurvedic-ecommerce

# Install dependencies and build for production
echo "Installing dependencies..."
cd backend && npm install
cd ../admin-panel && npm install && npm run build
cd ../client-website && npm install && npm run build

# Stop existing processes
echo "Stopping existing processes..."
pm2 delete all 2>/dev/null || true

# Start backend API
echo "Starting backend API..."
cd /home/ec2-user/ayurvedic-ecommerce/backend
pm2 start server.js --name "api"

# Start client website
echo "Starting client website..."
cd /home/ec2-user/ayurvedic-ecommerce/client-website
pm2 serve build 3001 --name "client" --spa

# Start admin panel on port 3002 to avoid conflicts
echo "Starting admin panel..."
cd /home/ec2-user/ayurvedic-ecommerce/admin-panel
pm2 serve build 3002 --name "admin" --spa

# Update nginx config
echo "Updating nginx config..."
sudo cp /home/ec2-user/ayurvedic-ecommerce/nginx.conf /etc/nginx/conf.d/learnonai.conf
sudo nginx -t && sudo systemctl reload nginx

pm2 save
echo "All services started!"