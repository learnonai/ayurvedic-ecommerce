#!/bin/bash
echo "🔧 Fixing admin panel connection issue..."

# Navigate to project directory
cd /home/ec2-user/ayurvedic-ecommerce

# Ensure admin panel is built
echo "📦 Building admin panel..."
cd admin-panel && npm run build

# Update nginx config to use the corrected version
echo "⚙️ Updating nginx config..."
sudo cp /home/ec2-user/ayurvedic-ecommerce/nginx.conf /etc/nginx/conf.d/learnonai.conf

# Remove any conflicting configs
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/learnonai.com

# Test nginx config
echo "🧪 Testing nginx config..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx config is valid, reloading..."
    sudo systemctl reload nginx
    echo "🎉 Admin panel should now be accessible at https://learnonai.com:8080"
else
    echo "❌ Nginx config has errors. Please check the configuration."
fi

# Check if port 8080 is open
echo "🔍 Checking if port 8080 is accessible..."
sudo netstat -tlnp | grep :8080