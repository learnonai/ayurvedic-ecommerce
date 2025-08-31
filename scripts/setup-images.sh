#!/bin/bash

# Script to setup images in pdt-img folder
echo "🖼️  Setting up product images..."

# Create pdt-img directory
mkdir -p backend/pdt-img

# Copy all sample images to pdt-img
cp backend/sample-images/* backend/pdt-img/ 2>/dev/null || true

echo "✅ Images copied to pdt-img folder"
echo "📁 Available images:"
ls -la backend/pdt-img/