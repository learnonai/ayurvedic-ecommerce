#!/bin/bash

echo "🔄 Restarting backend with new PhonePe integration..."

# Navigate to backend directory
cd backend

# Kill existing process if running
pkill -f "node server.js" || true

# Start backend server
echo "🚀 Starting backend server..."
nohup node server.js > ../logs/backend.log 2>&1 &

echo "✅ Backend restarted successfully!"
echo "📋 Check logs: tail -f logs/backend.log"
echo "🌐 Backend running on: http://localhost:5000"