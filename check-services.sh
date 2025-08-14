#!/bin/bash

echo "🔍 Checking what's running on EC2..."

echo "=== PM2 Processes ==="
pm2 list

echo -e "\n=== Port Usage ==="
netstat -tlnp | grep :3000 && echo "✅ Port 3000 in use" || echo "❌ Port 3000 empty"
netstat -tlnp | grep :3001 && echo "✅ Port 3001 in use" || echo "❌ Port 3001 empty"  
netstat -tlnp | grep :5000 && echo "✅ Port 5000 in use" || echo "❌ Port 5000 empty"

echo -e "\n=== Direct Port Tests ==="
curl -I http://localhost:3000 2>/dev/null && echo "✅ Port 3000 responds" || echo "❌ Port 3000 no response"
curl -I http://localhost:3001 2>/dev/null && echo "✅ Port 3001 responds" || echo "❌ Port 3001 no response"
curl -I http://localhost:5000 2>/dev/null && echo "✅ Port 5000 responds" || echo "❌ Port 5000 no response"

echo -e "\n=== Admin Panel Build Check ==="
ls -la /home/ubuntu/ayurvedic-ecommerce/admin-panel/build/ 2>/dev/null && echo "✅ Admin build exists" || echo "❌ Admin build missing"

echo -e "\n=== Nginx Config Test ==="
nginx -t

echo -e "\n=== Current Nginx Sites ==="
ls -la /etc/nginx/sites-enabled/

echo -e "\n=== Test Admin URL ==="
curl -I https://learnonai.com/admin 2>/dev/null || echo "❌ Admin URL not responding"