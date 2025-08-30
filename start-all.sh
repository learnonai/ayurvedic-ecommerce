#!/bin/bash

echo "🛑 Stopping all services..."
pkill -f "node server.js" 2>/dev/null || true
pkill -f "react-scripts start" 2>/dev/null || true
pkill -f "PORT=3000" 2>/dev/null || true
pkill -f "PORT=3001" 2>/dev/null || true

echo "🚀 Starting all services..."

# Start backend
echo "🔧 Starting backend on port 5000..."
(cd backend && NODE_PATH=../node_modules node server.js) &

sleep 2

# Start client website
echo "🌐 Starting client on port 3001..."
(cd client-website && PORT=3001 npm start) &

# Start admin panel
echo "👨💼 Starting admin on port 3000..."
(cd admin-panel && PORT=3000 npm start) &

echo "✅ All services started!"
echo "🌐 Client: http://localhost:3001"
echo "👨💼 Admin: http://localhost:3000"
echo "🔧 API: http://localhost:5000"

wait