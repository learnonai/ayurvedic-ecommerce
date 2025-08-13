#!/bin/bash

echo "🚀 Starting Ayurvedic Ecommerce locally..."

# Kill any existing processes on these ports
echo "Cleaning up existing processes..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Start backend
echo "Starting backend on port 5000..."
(cd backend && npm run dev) &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start admin panel
echo "Starting admin panel on port 3000..."
(cd admin-panel && npm start) &
ADMIN_PID=$!

# Start client website
echo "Starting client website on port 3001..."
(cd client-website && BROWSER=none PORT=3001 npm start) &
CLIENT_PID=$!

echo "✅ All services started!"
echo "🌐 Access URLs:"
echo "   Client:  http://localhost:3001"
echo "   Admin:   http://localhost:3000"
echo "   API:     http://localhost:5000/api"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap 'kill $BACKEND_PID $ADMIN_PID $CLIENT_PID 2>/dev/null; exit' INT
wait