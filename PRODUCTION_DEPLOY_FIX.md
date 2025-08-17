# 🚀 PRODUCTION DEPLOYMENT FIX

## 🔧 DEPLOY WITH THESE COMMANDS:

### 1. **Pull Latest Changes**
```bash
cd /home/ec2-user/ayurvedic-ecommerce && git pull origin main
```

### 2. **Stop Services**
```bash
pm2 delete all
```

### 3. **Setup Backend**
```bash
mkdir -p backend/uploads
cp backend/sample-images/* backend/uploads/
cd backend && npm install && pm2 start server.js --name "api"
```

### 4. **Build and Deploy Client (FIXED)**
```bash
cd ../client-website
npm install
npm run build

# IMPORTANT: Remove conflicting directories
rm -rf build/policies/
rm -rf build/uploads/

# Start with SPA flag for React Router
pm2 serve build 3001 --name "client" --spa
```

### 5. **Reload Nginx and Save**
```bash
sudo systemctl reload nginx
pm2 save
```

## ✅ FIXES APPLIED:

1. **Environment Detection**: Now uses `window.location.hostname` instead of `NODE_ENV`
2. **Production Environment Variables**: Added to `.env.production`
3. **Removed Static Conflicts**: Commands to remove conflicting directories
4. **SPA Flag**: Ensures React Router works in production

## 🎯 ONE-LINER DEPLOYMENT:
```bash
cd /home/ec2-user/ayurvedic-ecommerce && git pull origin main && pm2 delete all && mkdir -p backend/uploads && cp backend/sample-images/* backend/uploads/ && cd backend && npm install && pm2 start server.js --name "api" && cd ../client-website && npm install && npm run build && rm -rf build/policies/ build/uploads/ && pm2 serve build 3001 --name "client" --spa && sudo systemctl reload nginx && pm2 save
```

## 🔍 VERIFY DEPLOYMENT:
```bash
pm2 status
curl https://learnonai.com/api/products
curl https://learnonai.com/api/policies
```

**This should fix the local vs production differences!**