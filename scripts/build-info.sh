#!/bin/bash

# Build information script
BACKUP_DIR="/home/ec2-user/backups"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Build Information${NC}"
echo "=================================="

# Current build info
if [ -f "$BACKUP_DIR/last_successful_build.txt" ]; then
    CURRENT_BUILD=$(cat $BACKUP_DIR/last_successful_build.txt)
    echo -e "${GREEN}Current Build: $CURRENT_BUILD${NC}"
else
    echo -e "${YELLOW}No current build information found${NC}"
fi

echo ""
echo -e "${BLUE}📋 Available Builds:${NC}"
echo "=================================="

# List all available backups
if [ -d "$BACKUP_DIR" ]; then
    ls -la $BACKUP_DIR/app_backup_*.tar.gz 2>/dev/null | while read line; do
        filename=$(echo $line | awk '{print $9}')
        build_id=$(basename $filename .tar.gz | sed 's/app_backup_//')
        size=$(echo $line | awk '{print $5}')
        date=$(echo $line | awk '{print $6, $7, $8}')
        echo -e "${YELLOW}Build ID: $build_id${NC}"
        echo -e "  Size: $size bytes"
        echo -e "  Date: $date"
        echo ""
    done
else
    echo -e "${YELLOW}No backup directory found${NC}"
fi

echo ""
echo -e "${BLUE}📝 Recent Deployment Log:${NC}"
echo "=================================="
if [ -f "$BACKUP_DIR/deployment_log.txt" ]; then
    tail -10 $BACKUP_DIR/deployment_log.txt
else
    echo -e "${YELLOW}No deployment log found${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Usage:${NC}"
echo "=================================="
echo "Deploy: ./scripts/deploy.sh"
echo "Rollback to latest: ./scripts/rollback.sh"
echo "Rollback to specific build: ./scripts/rollback.sh BUILD_ID"
echo "Build info: ./scripts/build-info.sh"