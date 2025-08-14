@echo off
echo 🚀 Starting Ayurvedic Ecommerce locally...

echo.
echo Starting backend on port 5000...
start "Backend" cmd /k "cd backend && npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting admin panel on port 3000...
start "Admin Panel" cmd /k "cd admin-panel && npm start"

echo.
echo Starting client website on port 3001...
start "Client Website" cmd /k "cd client-website && set BROWSER=none && set PORT=3001 && npm start"

echo.
echo ✅ All services are starting!
echo 🌐 Access URLs:
echo    Client Website:  http://localhost:3001
echo    Admin Panel:     http://localhost:3000  
echo    Backend API:     http://localhost:5000
echo.
echo 🔑 Login Credentials:
echo    Admin: admin@ayurveda.com / admin123
echo    Test User: test@example.com / password123
echo.
echo Press any key to exit...
pause >nul