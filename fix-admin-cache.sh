#!/bin/bash

# Quick fix for admin panel caching issue
set -e

echo "🔧 Fixing admin panel cache issue..."

# SSH into production and run fix
ssh -i ~/.ssh/your-key.pem ec2-user@learnonai.com << 'EOF'
cd /home/ec2-user/ayurvedic-ecommerce

# Stop admin panel
pm2 delete admin-panel || true

# Force clear all caches
cd admin-panel
rm -rf node_modules package-lock.json build .cache
npm cache clean --force

# Fresh install and build
npm install
GENERATE_SOURCEMAP=false INLINE_RUNTIME_CHUNK=false npm run build

# Add timestamp to force cache invalidation
BUILD_TIME=$(date +%s)
cd build
sed -i "s/<title>Herbal Admin Panel<\/title>/<title>Herbal Admin Panel - v${BUILD_TIME}<\/title>/" index.html

# Restart with new build
cd ..
pm2 serve build 3000 --name "admin-panel" --spa

# Clear nginx cache
sudo nginx -s reload

pm2 save
pm2 list

echo "✅ Admin panel cache fixed!"
EOF