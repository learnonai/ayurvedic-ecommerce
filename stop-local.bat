@echo off
echo 🛑 Stopping Ayurvedic Ecommerce services...

echo Killing processes on port 5000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /f /pid %%a >nul 2>&1

echo Killing processes on port 3000 (Admin Panel)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1

echo Killing processes on port 3001 (Client Website)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1

echo ✅ All services stopped!
pause