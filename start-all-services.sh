#!/bin/bash

# Kill existing processes
pkill -f "node server.js" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

echo "🚀 Starting all services..."

# Start Backend (Port 5000)
cd backend
nohup node server.js > ../logs/backend.log 2>&1 &
echo "✅ Backend started on http://localhost:5000"

# Start Admin Panel (Port 3000)
cd ../admin-panel
nohup npm start > ../logs/admin.log 2>&1 &
echo "✅ Admin Panel starting on http://localhost:3000"

# Start Client Website (Port 3001)
cd ../client-website
nohup npm start > ../logs/client.log 2>&1 &
echo "✅ Client Website starting on http://localhost:3001"

echo ""
echo "🌐 URLs:"
echo "Backend API: http://localhost:5000"
echo "Admin Panel: http://localhost:3000"
echo "Customer Site: http://localhost:3001"
echo ""
echo "📋 Check logs: tail -f logs/backend.log"