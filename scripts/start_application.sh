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

# Start backend API
echo "Starting backend API..."
cd /home/ec2-user/ayurvedic-ecommerce/backend
pm2 start server.js --name "api" -- --port 5000

# Start client website
echo "Starting client website..."
cd /home/ec2-user/ayurvedic-ecommerce/client-website
pm2 serve build 3001 --name "client" --spa

# Copy built admin panel to nginx directory
echo "Deploying admin panel..."
sudo rm -rf /var/www/html/admin
sudo mkdir -p /var/www/html/admin
sudo cp -r /home/ec2-user/ayurvedic-ecommerce/admin-panel/build/* /var/www/html/admin/
sudo chown -R nginx:nginx /var/www/html/admin

# Update nginx config for learnonai.com
echo "Updating nginx config..."
sudo cp /home/ec2-user/ayurvedic-ecommerce/nginx.conf /etc/nginx/conf.d/learnonai.conf
sudo nginx -t && sudo systemctl reload nginx

pm2 save
echo "All services started and deployed!"