#!/bin/bash

# Setup persistent image storage
set -e

PERSISTENT_IMAGES_DIR="/home/ec2-user/persistent-images"
APP_UPLOADS_DIR="/home/ec2-user/ayurvedic-ecommerce/backend/uploads"

echo "🖼️ Setting up persistent image storage..."

# Create persistent directory if not exists
mkdir -p $PERSISTENT_IMAGES_DIR

# Copy current uploads to persistent storage (one-time setup)
if [ -d "$APP_UPLOADS_DIR" ] && [ "$(ls -A $APP_UPLOADS_DIR)" ]; then
    echo "📁 Copying existing uploads to persistent storage..."
    cp -r $APP_UPLOADS_DIR/* $PERSISTENT_IMAGES_DIR/
fi

# Copy sample images to persistent storage if empty
if [ ! "$(ls -A $PERSISTENT_IMAGES_DIR)" ]; then
    echo "📷 Copying sample images to persistent storage..."
    cp /home/ec2-user/ayurvedic-ecommerce/backend/sample-images/* $PERSISTENT_IMAGES_DIR/
fi

# Create symlink from uploads to persistent storage
rm -rf $APP_UPLOADS_DIR
ln -sf $PERSISTENT_IMAGES_DIR $APP_UPLOADS_DIR

echo "✅ Persistent image storage setup complete!"
echo "📍 Images stored at: $PERSISTENT_IMAGES_DIR"
echo "🔗 Symlinked to: $APP_UPLOADS_DIR"