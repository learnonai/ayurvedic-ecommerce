#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🌿 Starting Ayurvedic Ecommerce System...${NC}"

# STOP ALL SERVICES FIRST
echo -e "${YELLOW}🛑 Stopping all existing services...${NC}"

# Stop PM2 processes if running
echo -e "${YELLOW}   Stopping PM2 processes...${NC}"
pm2 delete all 2>/dev/null || true

# Kill processes on specific ports
echo -e "${YELLOW}   Stopping Backend API (Port 5000)...${NC}"
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

echo -e "${YELLOW}   Stopping Admin Panel (Port 3000)...${NC}"
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo -e "${YELLOW}   Stopping Client Website (Port 3001)...${NC}"
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Kill any node processes that might be hanging
echo -e "${YELLOW}   Cleaning up remaining processes...${NC}"
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "react-scripts start" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true

echo -e "${GREEN}✅ All services stopped${NC}"
sleep 2

# Function to check if port is free
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 1  # Port is busy
    else
        return 0  # Port is free
    fi
}

# Function to wait for service to start
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}   Waiting for $service_name to start on port $port...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if check_port $port; then
            sleep 1
            attempt=$((attempt + 1))
        else
            echo -e "${GREEN}   ✅ $service_name started successfully${NC}"
            return 0
        fi
    done
    
    echo -e "${RED}   ❌ $service_name failed to start within 30 seconds${NC}"
    return 1
}

# Create logs directory if it doesn't exist
mkdir -p logs

# START BACKEND API
echo -e "${BLUE}🔧 Starting Backend API...${NC}"
cd backend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing backend dependencies...${NC}"
    npm install
fi

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Start backend in background
npm start > ../logs/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
if wait_for_service 5000 "Backend API"; then
    echo -e "${GREEN}✅ Backend API running (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ Backend API failed to start${NC}"
    exit 1
fi

cd ..

# START ADMIN PANEL
echo -e "${BLUE}👨💼 Starting Admin Panel...${NC}"
cd admin-panel
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing admin panel dependencies...${NC}"
    npm install
fi

# Start admin panel in background
PORT=3000 BROWSER=none npm start > ../logs/admin.log 2>&1 &
ADMIN_PID=$!

# Wait for admin panel to start
if wait_for_service 3000 "Admin Panel"; then
    echo -e "${GREEN}✅ Admin Panel running (PID: $ADMIN_PID)${NC}"
else
    echo -e "${RED}❌ Admin Panel failed to start${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

cd ..

# START CLIENT WEBSITE
echo -e "${BLUE}🌐 Starting Client Website...${NC}"
cd client-website
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}   Installing client website dependencies...${NC}"
    npm install
fi

# Start client website in background
PORT=3001 BROWSER=none npm start > ../logs/client.log 2>&1 &
CLIENT_PID=$!

# Wait for client website to start
if wait_for_service 3001 "Client Website"; then
    echo -e "${GREEN}✅ Client Website running (PID: $CLIENT_PID)${NC}"
else
    echo -e "${RED}❌ Client Website failed to start${NC}"
    kill $BACKEND_PID $ADMIN_PID 2>/dev/null || true
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}🚀 All services started successfully!${NC}"
echo "=================================="
echo -e "${BLUE}📱 Client Website:${NC} http://localhost:3001"
echo -e "${BLUE}👨💼 Admin Panel:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Backend API:${NC} http://localhost:5000"
echo ""
echo -e "${YELLOW}📋 Service PIDs:${NC}"
echo -e "   Backend: $BACKEND_PID"
echo -e "   Admin: $ADMIN_PID"
echo -e "   Client: $CLIENT_PID"
echo ""
echo -e "${YELLOW}📝 Logs:${NC}"
echo -e "   Backend: logs/backend.log"
echo -e "   Admin: logs/admin.log"
echo -e "   Client: logs/client.log"
echo ""
echo -e "${RED}Press Ctrl+C to stop all services${NC}"

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"
    kill $BACKEND_PID $ADMIN_PID $CLIENT_PID 2>/dev/null || true
    pm2 delete all 2>/dev/null || true
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}✅ All services stopped. Goodbye!${NC}"
    exit 0
}

# Set trap to handle Ctrl+C
trap cleanup SIGINT SIGTERM

# Wait for user input
wait