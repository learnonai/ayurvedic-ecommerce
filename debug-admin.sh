#!/bin/bash

echo "🔍 Debugging admin panel issue..."

# Check what's running on ports
echo "=== Checking ports ==="
netstat -tlnp | grep :3000 || echo "❌ Nothing on port 3000"
netstat -tlnp | grep :3001 || echo "❌ Nothing on port 3001"
netstat -tlnp | grep :5000 || echo "❌ Nothing on port 5000"

# Check PM2 processes
echo -e "\n=== PM2 Processes ==="
pm2 list

# Test direct access
echo -e "\n=== Testing direct access ==="
curl -I http://localhost:3000 2>/dev/null || echo "❌ Port 3000 not responding"
curl -I http://localhost:3001 2>/dev/null || echo "❌ Port 3001 not responding"

# Check nginx config
echo -e "\n=== Nginx config test ==="
nginx -t

echo -e "\n=== Fix: Restart all services ==="
pm2 delete all
cd /home/ubuntu/ayurvedic-ecommerce

# Start backend
cd backend && pm2 start server.js --name "api" &

# Build and start admin on port 3000
cd ../admin-panel && npm run build && pm2 serve build 3000 --name "admin" --spa &

# Build and start client on port 3001  
cd ../client-website && npm run build && pm2 serve build 3001 --name "client" --spa &

sleep 5
pm2 save

echo "✅ Services restarted. Check https://learnonai.com/admin"