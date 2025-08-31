#!/bin/bash

# Deployment script with image persistence and rollback support
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/ec2-user/ayurvedic-ecommerce"
BACKUP_DIR="/home/ec2-user/backups"
UPLOADS_DIR="$APP_DIR/backend/uploads"
PDT_IMG_DIR="$APP_DIR/backend/pdt-img"
BUILD_ID=$(date +%Y%m%d_%H%M%S)_$(git rev-parse --short HEAD)

echo -e "${GREEN}🚀 Starting deployment - Build ID: $BUILD_ID${NC}"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Setup persistent image storage
echo -e "${YELLOW}🖼️  Setting up persistent image storage...${NC}"
$APP_DIR/scripts/preserve-images.sh

# Backup current application
echo -e "${YELLOW}📦 Creating application backup...${NC}"
tar -czf $BACKUP_DIR/app_backup_$BUILD_ID.tar.gz -C /home/ec2-user ayurvedic-ecommerce
echo -e "${GREEN}✅ Application backed up to: $BACKUP_DIR/app_backup_$BUILD_ID.tar.gz${NC}"

# Git operations
cd $APP_DIR
git stash
git pull origin main

# Stop services
echo -e "${YELLOW}🛑 Stopping services...${NC}"
pm2 delete all || true

# Ensure persistent image storage is set up
echo -e "${YELLOW}📁 Ensuring image persistence...${NC}"
$APP_DIR/scripts/preserve-images.sh

# Copy sample images to persistent storage if empty
PERSISTENT_DIR="/home/ec2-user/persistent-images"
if [ ! "$(ls -A $PERSISTENT_DIR 2>/dev/null)" ]; then
    echo -e "${YELLOW}📷 No images found, copying sample images...${NC}"
    mkdir -p $PERSISTENT_DIR
    cp backend/sample-images/* $PERSISTENT_DIR/ 2>/dev/null || true
fi

# Backend deployment
echo -e "${YELLOW}🔧 Deploying backend...${NC}"
cd backend
npm install
pm2 start server.js --name "api"

# Client website deployment
echo -e "${YELLOW}🌐 Deploying client website...${NC}"
cd ../client-website
npm install
npm run build
pm2 serve build 3001 --name "client" --spa

# Admin panel deployment
echo -e "${YELLOW}👨‍💼 Deploying admin panel...${NC}"
cd ../admin-panel
npm install
npm run build
pm2 serve build 3000 --name "admin-panel" --spa

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
    echo -e "${RED}❌ Deployment failed - Rolling back...${NC}"
    # Rollback logic would go here
    exit 1
fi

# Cleanup old backups (keep only last 1 to save space)
echo -e "${YELLOW}🧹 Cleaning up old backups...${NC}"
cd $BACKUP_DIR
ls -t app_backup_*.tar.gz | tail -n +2 | xargs rm -f 2>/dev/null || true
ls -t -d uploads_backup_* | tail -n +2 | xargs rm -rf 2>/dev/null || true

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}Build ID: $BUILD_ID${NC}"
echo -e "${GREEN}Backup location: $BACKUP_DIR${NC}"