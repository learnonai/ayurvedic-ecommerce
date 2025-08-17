#!/bin/bash

echo "🌿 Starting Ayurvedic Ecommerce System..."

# Kill existing processes
echo "Stopping existing processes..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start backend
echo "Starting Backend API..."
cd backend && npm install && npm start &

# Wait for backend to start
sleep 3

# Start admin panel
echo "Starting Admin Panel..."
cd admin-panel && npm install && PORT=3000 npm start &

# Wait a bit
sleep 2

# Start client website
echo "Starting Client Website..."
cd client-website && npm install && BROWSER=none PORT=3001 npm start &

echo ""
echo "🚀 All services started!"
echo "📱 Client Website: http://localhost:3001"
echo "👨‍💼 Admin Panel: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user input
wait