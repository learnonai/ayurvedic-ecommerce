#!/bin/bash

echo "🔧 Fixing admin panel routing..."

# Check if admin panel is running on port 3000
echo "Checking if admin panel is running on port 3000..."
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "❌ Admin panel not running on port 3000"
    echo "Starting admin panel..."
    cd admin-panel && npm start &
    sleep 5
else
    echo "✅ Admin panel is running on port 3000"
fi

# Restart nginx
echo "Restarting nginx..."
sudo systemctl restart nginx

echo "✅ Admin panel should now work at https://www.learnonai.com/admin"