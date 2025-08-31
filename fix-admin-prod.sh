#!/bin/bash

echo "🔧 Fixing Admin Panel Production Issues..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Step 1: Clearing browser cache and rebuilding admin panel..."

# Navigate to admin panel
cd admin-panel

# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Build for production with cache busting
print_status "Building admin panel with cache busting..."
GENERATE_SOURCEMAP=false npm run build

# Go back to root
cd ..

print_status "Step 2: Updating backend data consistency..."

# Ensure all orders have archived field
node -e "
const fs = require('fs');
const path = './backend/data/orders.json';
const orders = JSON.parse(fs.readFileSync(path, 'utf8'));
const updated = orders.map(order => ({
  ...order,
  archived: order.archived !== undefined ? order.archived : false,
  status: order.status || 'pending'
}));
fs.writeFileSync(path, JSON.stringify(updated, null, 2));
console.log('✅ Orders data updated with missing fields');
"

print_status "Step 3: Creating production deployment package..."

# Create a deployment script for production
cat > deploy-admin-fix.sh << 'EOF'
#!/bin/bash

echo "🚀 Deploying Admin Panel Fix to Production..."

# Stop existing processes
pm2 stop all

# Backup current admin panel
if [ -d "admin-panel" ]; then
    cp -r admin-panel admin-panel-backup-$(date +%Y%m%d_%H%M%S)
fi

# Copy new admin panel build
if [ -d "admin-panel/build" ]; then
    rm -rf admin-panel-old
    mv admin-panel admin-panel-old
    mkdir -p admin-panel
    cp -r admin-panel-old/build admin-panel/
    cp -r admin-panel-old/src admin-panel/
    cp admin-panel-old/package.json admin-panel/
fi

# Restart services with cache clearing
pm2 restart all

# Clear nginx cache if exists
if command -v nginx &> /dev/null; then
    sudo nginx -s reload
fi

echo "✅ Admin panel fix deployed successfully!"
echo "🌐 Access admin panel at: https://learnonai.com:8080"
echo "📝 Clear browser cache (Ctrl+Shift+R) for best results"
EOF

chmod +x deploy-admin-fix.sh

print_status "Step 4: Testing API connectivity..."

# Test backend API
if command -v curl &> /dev/null; then
    echo "Testing backend API..."
    if curl -s http://localhost:5000/api > /dev/null; then
        print_status "✅ Backend API is running locally"
    else
        print_warning "⚠️  Backend API not responding locally"
    fi
else
    print_warning "curl not available for API testing"
fi

print_status "✅ Admin Panel Fix Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Copy the updated files to your EC2 instance"
echo "2. Run the deploy-admin-fix.sh script on production"
echo "3. Clear browser cache (Ctrl+Shift+R) when accessing admin panel"
echo "4. Check browser console for any remaining errors"
echo ""
echo "🔍 Debugging Tips:"
echo "- Check browser Network tab for failed API calls"
echo "- Verify backend is running: pm2 list"
echo "- Check backend logs: pm2 logs"
echo "- Test API directly: curl https://learnonai.com/api/orders"