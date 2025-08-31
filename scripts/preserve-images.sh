#!/bin/bash

# Script to preserve uploaded images during deployments
# This creates a persistent image storage outside the git repo

PERSISTENT_DIR="/home/ec2-user/persistent-images"
PROJECT_DIR="/home/ec2-user/ayurvedic-ecommerce"
BACKEND_IMG_DIR="$PROJECT_DIR/backend/pdt-img"

echo "🖼️  Setting up persistent image storage..."

# Create persistent directory if it doesn't exist
if [ ! -d "$PERSISTENT_DIR" ]; then
    echo "Creating persistent image directory: $PERSISTENT_DIR"
    mkdir -p "$PERSISTENT_DIR"
    
    # Copy existing images if any
    if [ -d "$BACKEND_IMG_DIR" ]; then
        echo "Copying existing images to persistent storage..."
        cp -r "$BACKEND_IMG_DIR"/* "$PERSISTENT_DIR/" 2>/dev/null || true
    fi
fi

# Remove the pdt-img directory if it exists and is not a symlink
if [ -d "$BACKEND_IMG_DIR" ] && [ ! -L "$BACKEND_IMG_DIR" ]; then
    echo "Backing up current images..."
    cp -r "$BACKEND_IMG_DIR"/* "$PERSISTENT_DIR/" 2>/dev/null || true
    rm -rf "$BACKEND_IMG_DIR"
fi

# Create symlink to persistent directory
if [ ! -L "$BACKEND_IMG_DIR" ]; then
    echo "Creating symlink: $BACKEND_IMG_DIR -> $PERSISTENT_DIR"
    ln -sf "$PERSISTENT_DIR" "$BACKEND_IMG_DIR"
fi

# Set proper permissions
chmod 755 "$PERSISTENT_DIR"
chown -R ec2-user:ec2-user "$PERSISTENT_DIR" 2>/dev/null || true

echo "✅ Image persistence setup complete!"
echo "📁 Persistent storage: $PERSISTENT_DIR"
echo "🔗 Symlink created: $BACKEND_IMG_DIR"