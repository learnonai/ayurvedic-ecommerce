#!/bin/bash

# Image sync script for herbal ecommerce
# This script syncs uploaded images to git repository

echo "🖼️  Syncing images to git repository..."

# Add all new images to git
git add backend/uploads/*

# Check if there are any changes
if git diff --staged --quiet; then
    echo "ℹ️  No new images to sync"
else
    # Commit the images
    git commit -m "Add product images: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # Push to repository
    git push origin main
    
    echo "✅ Images synced successfully!"
fi

echo "🔄 Image sync complete"