#!/bin/bash

# Script to create consistent product placeholder images
SAMPLE_DIR="backend/sample-images"
mkdir -p $SAMPLE_DIR

echo "🎨 Creating consistent product images..."

# Copy the main leaf image for all products that need it
if [ -f "$SAMPLE_DIR/herbal-leaf-default.jpg" ]; then
    # Create category-specific images
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/coconut-oil.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/lavender-oil.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/rosemary-oil.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/face-oil.jpg"
    
    # Capsules
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/ashwagandha-capsules.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/turmeric-capsules.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/brahmi-capsules.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/triphala-capsules.jpg"
    
    # Skincare
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/neem-face-wash.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/turmeric-face-pack.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/aloe-moisturizer.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/rose-water-toner.jpg"
    
    # Powders
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/amla-powder.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/moringa-powder.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/spirulina-powder.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/wheatgrass-powder.jpg"
    
    # Teas
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/digestive-tea.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/immunity-tea.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/stress-relief-tea.jpg"
    cp "$SAMPLE_DIR/herbal-leaf-default.jpg" "$SAMPLE_DIR/detox-tea.jpg"
    
    echo "✅ Product images created successfully!"
else
    echo "❌ herbal-leaf-default.jpg not found in $SAMPLE_DIR"
fi