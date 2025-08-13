#!/bin/bash

echo "🔧 Fixing nginx configuration for admin panel..."

# Test nginx configuration
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
    
    # Check nginx status
    sudo systemctl status nginx --no-pager -l
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

echo "🎉 Admin panel should now work at https://www.learnonai.com/admin"