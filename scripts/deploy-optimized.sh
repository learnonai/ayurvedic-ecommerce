#!/bin/bash

# Optimized deployment script with persistent images and shared dependencies
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/ec2-user/ayurvedic-ecommerce"
BACKUP_DIR="/home/ec2-user/backups"
PERSISTENT_IMAGES_DIR="/home/ec2-user/persistent-images"
UPLOADS_DIR="$APP_DIR/backend/uploads"
BUILD_ID=$(date +%Y%m%d_%H%M%S)_$(git rev-parse --short HEAD)

echo -e "${GREEN}🚀 Starting optimized deployment - Build ID: $BUILD_ID${NC}"

# Create directories
mkdir -p $BACKUP_DIR
mkdir -p $PERSISTENT_IMAGES_DIR

# Backup current application
echo -e "${YELLOW}📦 Creating application backup...${NC}"
tar -czf $BACKUP_DIR/app_backup_$BUILD_ID.tar.gz -C /home/ec2-user ayurvedic-ecommerce

# Git operations
cd $APP_DIR
git stash
git pull origin main

# Stop services
echo -e "${YELLOW}🛑 Stopping services...${NC}"
pm2 delete all || true

# Setup persistent images (one-time)
echo -e "${YELLOW}🖼️ Setting up persistent images...${NC}"

# Copy sample images to persistent storage if empty
if [ ! "$(ls -A $PERSISTENT_IMAGES_DIR)" ]; then
    echo -e "${YELLOW}📷 Copying sample images to persistent storage...${NC}"
    cp backend/sample-images/* $PERSISTENT_IMAGES_DIR/ 2>/dev/null || true
fi

# Create symlink from uploads to persistent storage
rm -rf $UPLOADS_DIR
ln -sf $PERSISTENT_IMAGES_DIR $UPLOADS_DIR
echo -e "${GREEN}✅ Images linked to persistent storage${NC}"

# Optimized dependency installation using workspace
echo -e "${YELLOW}📦 Installing dependencies (shared workspace)...${NC}"
npm install

# Backend deployment
echo -e "${YELLOW}🔧 Deploying backend...${NC}"
pm2 start backend/server.js --name "api"

# Build frontend apps
echo -e "${YELLOW}🏗️ Building frontend applications...${NC}"
npm run build-client
npm run build-admin

# Deploy frontend apps
echo -e "${YELLOW}🌐 Deploying client website...${NC}"
pm2 serve client-website/build 3001 --name "client" --spa

echo -e "${YELLOW}👨💼 Deploying admin panel...${NC}"
pm2 serve admin-panel/build 3000 --name "admin-panel" --spa

# Reload nginx
sudo systemctl reload nginx

# Save PM2 configuration
pm2 save

# Health check
echo -e "${YELLOW}🏥 Performing health check...${NC}"
sleep 5

# Check if services are running
if pm2 list | grep -q "online"; then
    echo -e "${GREEN}✅ Deployment successful - Build ID: $BUILD_ID${NC}"
    echo -e "${GREEN}📊 Services status:${NC}"
    pm2 list
    
    # Save successful build info
    echo "$BUILD_ID" > $BACKUP_DIR/last_successful_build.txt
    echo "$(date): Deployment successful - Build ID: $BUILD_ID" >> $BACKUP_DIR/deployment_log.txt
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Cleanup old backups (keep only last 1)
echo -e "${YELLOW}🧹 Cleaning up old backups...${NC}"
cd $BACKUP_DIR
ls -t app_backup_*.tar.gz | tail -n +2 | xargs rm -f 2>/dev/null || true

echo -e "${GREEN}🎉 Optimized deployment completed!${NC}"
echo -e "${GREEN}Build ID: $BUILD_ID${NC}"
echo -e "${GREEN}Images: $PERSISTENT_IMAGES_DIR${NC}"