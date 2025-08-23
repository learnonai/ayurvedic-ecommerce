#!/bin/bash

echo "🔧 Fixing Admin Panel Issues..."

# Kill existing processes
echo "Stopping existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Navigate to admin panel
cd admin-panel

# Clean install
echo "Cleaning and reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install

# Build for production (if needed)
if [ "$1" = "build" ]; then
  echo "Building for production..."
  npm run build
fi

# Start admin panel
echo "Starting Admin Panel..."
PORT=3000 npm start

echo "✅ Admin Panel should now be running on http://localhost:3000"