#!/bin/bash

echo "🔧 Fixing port mapping..."

# Stop all services
pm2 stop all
pm2 delete all

# Kill any processes on ports
sudo lsof -ti:3000 | xargs sudo kill -9 2>/dev/null || true
sudo lsof -ti:3001 | xargs sudo kill -9 2>/dev/null || true
sudo lsof -ti:5000 | xargs sudo kill -9 2>/dev/null || true

# Start backend on port 5000
cd backend
pm2 start server.js --name "backend"
cd ..

# Start admin panel on port 3000
cd admin-panel
PORT=3000 pm2 start npm --name "admin" -- start
cd ..

# Start client website on port 3001
cd client-website
PORT=3001 pm2 start npm --name "client" -- start
cd ..

# Update nginx and restart
sudo cp nginx.conf /etc/nginx/sites-available/learnonai.com
sudo nginx -t && sudo systemctl reload nginx

# Save PM2 processes
pm2 save

echo "✅ Port mapping fixed!"
echo "Backend: localhost:5000"
echo "Admin: localhost:3000 → https://www.learnonai.com/admin"
echo "Client: localhost:3001 → https://www.learnonai.com"