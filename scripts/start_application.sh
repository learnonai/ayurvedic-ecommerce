#!/bin/bash
cd /home/ubuntu/ayurvedic-ecommerce

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
cd /home/ubuntu/ayurvedic-ecommerce/backend
pm2 start server.js --name "api"

# Admin panel served as static files via nginx
echo "Admin panel will be served as static files via nginx"

cd /home/ubuntu/ayurvedic-ecommerce/client-website
pm2 serve build 3001 --name "client" --spa

# Copy nginx config
echo "Updating nginx config..."
sudo cp /home/ubuntu/ayurvedic-ecommerce/nginx.conf /etc/nginx/sites-available/learnonai.com
sudo ln -sf /etc/nginx/sites-available/learnonai.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

pm2 save
echo "All services started!"