#!/bin/bash

# Create sample-images directory if it doesn't exist
mkdir -p backend/sample-images

# Copy all images from uploads to sample-images
echo "Copying sample images..."
cp backend/uploads/*.* backend/sample-images/ 2>/dev/null || echo "No images found in uploads folder"

# Update .gitignore to exclude uploads but include sample-images
echo "Updating .gitignore..."
if ! grep -q "sample-images" .gitignore; then
    sed -i.bak 's|uploads/|uploads/\n!backend/sample-images/|' .gitignore
fi

echo "Sample images setup complete!"
echo "Images copied to backend/sample-images/ and will be committed to repository"