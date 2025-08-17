#!/bin/bash
echo "🚀 Starting production deployment..."

cd /home/ec2-user/ayurvedic-ecommerce

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies and build
echo "📦 Installing dependencies and building..."
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

# Copy admin build to nginx directory (no PM2 needed)
echo "👨💼 Deploying admin panel as static files..."
sudo mkdir -p /var/www/html/admin
sudo cp -r /home/ec2-user/ayurvedic-ecommerce/admin-panel/build/* /var/www/html/admin/ 2>/dev/null || true

# Use production nginx config
echo "⚙️ Updating nginx config..."
sudo cp /home/ec2-user/ayurvedic-ecommerce/nginx-production.conf /etc/nginx/conf.d/learnonai.conf

# Test and reload nginx
sudo nginx -t && sudo systemctl reload nginx

# Save PM2 processes
pm2 save

echo "✅ Production deployment complete!"
echo "🌐 Client: https://learnonai.com"
echo "👨💼 Admin: https://learnonai.com:8080"
echo "🔧 API: https://learnonai.com/api"
echo "🖼️ Images: https://learnonai.com/uploads/"