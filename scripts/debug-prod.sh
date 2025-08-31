#!/bin/bash

echo "🔍 Debugging Production Issues..."

# Check current git status
echo "=== Git Status ==="
git log --oneline -5
echo ""

# Check if admin panel source has the new features
echo "=== Admin Panel Orders.js Check ==="
grep -n "filterPeriod\|sortBy\|archived" admin-panel/src/pages/Orders.js | head -5
echo ""

# Check build directory
echo "=== Build Directory Check ==="
ls -la admin-panel/build/static/js/ | head -3
echo ""

# Check PM2 processes
echo "=== PM2 Status ==="
pm2 list
echo ""

# Check disk space
echo "=== Disk Space ==="
df -h
echo ""

# Check memory
echo "=== Memory Usage ==="
free -h
echo ""

# Check if build contains new features
echo "=== Checking if build contains new features ==="
if grep -q "filterPeriod" admin-panel/build/static/js/main.*.js 2>/dev/null; then
    echo "✅ New features found in build"
else
    echo "❌ New features NOT found in build - Need to rebuild"
fi