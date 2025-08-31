#!/bin/bash

# Cache-busting deployment script
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_DIR="/home/ec2-user/ayurvedic-ecommerce"
BUILD_ID=$(date +%Y%m%d_%H%M%S)_$(git rev-parse --short HEAD)

echo -e "${GREEN}🚀 Cache-busting deployment - Build ID: $BUILD_ID${NC}"

cd $APP_DIR

# Stop services
echo -e "${YELLOW}🛑 Stopping services...${NC}"
pm2 delete all || true

# Git operations
git stash
git pull origin main

# Backend deployment
echo -e "${YELLOW}🔧 Deploying backend...${NC}"
cd backend
npm install
pm2 start server.js --name "api"

# Client website deployment with cache busting
echo -e "${YELLOW}🌐 Deploying client website...${NC}"
cd ../client-website
rm -rf node_modules package-lock.json build
npm install
GENERATE_SOURCEMAP=false npm run build
pm2 serve build 3001 --name "client" --spa

# Admin panel deployment with aggressive cache busting
echo -e "${YELLOW}👨💼 Deploying admin panel with cache busting...${NC}"
cd ../admin-panel

# Clear all caches
rm -rf node_modules package-lock.json build .cache
npm cache clean --force

# Install and build with cache busting
npm install
GENERATE_SOURCEMAP=false INLINE_RUNTIME_CHUNK=false npm run build

# Add cache-busting timestamp to built files
cd build/static/js
for file in *.js; do
    if [[ $file != *"$BUILD_ID"* ]]; then
        mv "$file" "${file%.*}_${BUILD_ID}.${file##*.}"
    fi
done

cd ../css
for file in *.css; do
    if [[ $file != *"$BUILD_ID"* ]]; then
        mv "$file" "${file%.*}_${BUILD_ID}.${file##*.}"
    fi
done

cd ../../..

# Update index.html with new filenames
cd build
sed -i "s/static\/js\/main\.[^\"]*\.js/static\/js\/main_${BUILD_ID}.js/g" index.html
sed -i "s/static\/css\/main\.[^\"]*\.css/static\/css\/main_${BUILD_ID}.css/g" index.html

cd ..

# Start admin panel
pm2 serve build 3000 --name "admin-panel" --spa

# Reload nginx with cache headers
sudo systemctl reload nginx

# Save PM2 configuration
pm2 save

echo -e "${GREEN}✅ Cache-busting deployment completed!${NC}"
echo -e "${GREEN}Build ID: $BUILD_ID${NC}"
pm2 list