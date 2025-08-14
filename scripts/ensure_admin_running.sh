#!/bin/bash

echo "🔧 Ensuring admin panel is running..."

# Check if admin panel is running on port 3000
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Admin panel not running. Starting it..."
    
    # Kill any existing process on port 3000
    sudo lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    # Start admin panel
    cd /home/ubuntu/ayurvedic-ecommerce/admin-panel
    npm run build
    pm2 delete admin-panel 2>/dev/null || true
    pm2 serve build 3000 --name "admin-panel" --spa
    
    echo "✅ Admin panel started on port 3000"
else
    echo "✅ Admin panel already running on port 3000"
fi

# Restart nginx
echo "Restarting nginx..."
sudo systemctl restart nginx

echo "✅ Admin panel should now work at https://learnonai.com/admin"