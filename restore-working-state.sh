#!/bin/bash

echo "🔄 Restoring to working state..."

# Stop all PM2 processes
pm2 stop all
pm2 delete all

# Kill any processes on the ports
sudo lsof -ti:3000 | xargs sudo kill -9 2>/dev/null || true
sudo lsof -ti:3001 | xargs sudo kill -9 2>/dev/null || true
sudo lsof -ti:5000 | xargs sudo kill -9 2>/dev/null || true

# Start backend
echo "Starting backend..."
cd backend
pm2 start server.js --name "backend"
cd ..

# Start client website on port 3001
echo "Starting client website..."
cd client-website
PORT=3001 pm2 start npm --name "client" -- start
cd ..

# Start admin panel on port 3000
echo "Starting admin panel..."
cd admin-panel
PORT=3000 pm2 start npm --name "admin" -- start
cd ..

# Update nginx configuration
echo "Updating nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/learnonai.com
sudo nginx -t && sudo systemctl reload nginx

# Save PM2 configuration
pm2 save

echo "✅ Restoration complete!"
echo ""
echo "🌐 Your applications:"
echo "   Customer Website: https://learnonai.com"
echo "   Admin Panel: https://learnonai.com/admin"
echo "   Backend API: https://learnonai.com/api"
echo ""
echo "📊 Check status: pm2 status"