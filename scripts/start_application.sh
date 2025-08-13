#!/bin/bash
cd /home/ec2-user/ayurvedic-ecommerce

# Install dependencies and build
echo "Installing dependencies..."
cd backend && npm install
cd ../admin-panel && npm install && npm run build
cd ../client-website && npm install && npm run build

# Start only backend service (nginx serves static files)
echo "Starting backend service..."
cd backend
pm2 delete api 2>/dev/null || true
pm2 start server.js --name "api"

# Copy nginx config
echo "Updating nginx config..."
sudo cp ../nginx.conf /etc/nginx/sites-available/learnonai.com
sudo ln -sf /etc/nginx/sites-available/learnonai.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

pm2 save
echo "Deployment completed!"