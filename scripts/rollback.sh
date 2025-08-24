#!/bin/bash

# Rollback script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKUP_DIR="/home/ec2-user/backups"
APP_DIR="/home/ec2-user/ayurvedic-ecommerce"

echo -e "${YELLOW}🔄 Starting rollback process...${NC}"

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}❌ Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# List available backups
echo -e "${YELLOW}📋 Available backups:${NC}"
ls -la $BACKUP_DIR/app_backup_*.tar.gz 2>/dev/null || {
    echo -e "${RED}❌ No backups found${NC}"
    exit 1
}

# Get the most recent backup or use provided build ID
if [ -z "$1" ]; then
    BACKUP_FILE=$(ls -t $BACKUP_DIR/app_backup_*.tar.gz | head -n 1)
    BUILD_ID=$(basename $BACKUP_FILE .tar.gz | sed 's/app_backup_//')
else
    BUILD_ID=$1
    BACKUP_FILE="$BACKUP_DIR/app_backup_$BUILD_ID.tar.gz"
fi

echo -e "${YELLOW}🔄 Rolling back to Build ID: $BUILD_ID${NC}"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

# Stop current services
echo -e "${YELLOW}🛑 Stopping current services...${NC}"
pm2 delete all || true

# Backup current state before rollback
ROLLBACK_BACKUP="$BACKUP_DIR/pre_rollback_$(date +%Y%m%d_%H%M%S).tar.gz"
echo -e "${YELLOW}📦 Creating pre-rollback backup...${NC}"
tar -czf $ROLLBACK_BACKUP -C /home/ec2-user ayurvedic-ecommerce

# Extract backup
echo -e "${YELLOW}📂 Extracting backup...${NC}"
cd /home/ec2-user
tar -xzf $BACKUP_FILE

# Restore uploads if available
UPLOADS_BACKUP="$BACKUP_DIR/uploads_backup_$BUILD_ID"
if [ -d "$UPLOADS_BACKUP" ]; then
    echo -e "${YELLOW}📁 Restoring uploads...${NC}"
    cp -r $UPLOADS_BACKUP/* $APP_DIR/backend/uploads/ 2>/dev/null || true
fi

# Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
cd $APP_DIR

# Start backend
cd backend
pm2 start server.js --name "api"

# Start client
cd ../client-website
pm2 serve build 3001 --name "client" --spa

# Start admin panel
cd ../admin-panel
pm2 serve build 3000 --name "admin-panel" --spa

# Reload nginx
sudo systemctl reload nginx
pm2 save

# Health check
echo -e "${YELLOW}🏥 Performing health check...${NC}"
sleep 5

if pm2 list | grep -q "online"; then
    echo -e "${GREEN}✅ Rollback successful to Build ID: $BUILD_ID${NC}"
    echo -e "${GREEN}📊 Services status:${NC}"
    pm2 list
    
    # Log rollback
    echo "$(date): Rollback successful to Build ID: $BUILD_ID" >> $BACKUP_DIR/deployment_log.txt
else
    echo -e "${RED}❌ Rollback failed${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Rollback completed successfully!${NC}"