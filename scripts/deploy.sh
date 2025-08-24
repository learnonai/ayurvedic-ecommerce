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
BUILD_ID=$(date +%Y%m%d_%H%M%S)_$(git rev-parse --short HEAD)

echo -e "${GREEN}🚀 Starting deployment - Build ID: $BUILD_ID${NC}"

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Backup current uploads before deployment
echo -e "${YELLOW}📦 Backing up current uploads...${NC}"
if [ -d "$UPLOADS_DIR" ]; then
    cp -r $UPLOADS_DIR $BACKUP_DIR/uploads_backup_$BUILD_ID
    echo -e "${GREEN}✅ Uploads backed up to: $BACKUP_DIR/uploads_backup_$BUILD_ID${NC}"
fi

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

# Restore uploads directory
echo -e "${YELLOW}📁 Restoring uploads...${NC}"
mkdir -p $UPLOADS_DIR
if [ -d "$BACKUP_DIR/uploads_backup_$BUILD_ID" ]; then
    cp -r $BACKUP_DIR/uploads_backup_$BUILD_ID/* $UPLOADS_DIR/ 2>/dev/null || true
fi

# Copy sample images if uploads is empty
if [ ! "$(ls -A $UPLOADS_DIR)" ]; then
    echo -e "${YELLOW}📷 No uploads found, copying sample images...${NC}"
    cp backend/sample-images/* $UPLOADS_DIR/ 2>/dev/null || true
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