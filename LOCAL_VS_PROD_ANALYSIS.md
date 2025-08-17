# 🔍 LOCAL vs PRODUCTION CONFIGURATION ANALYSIS

## 🚨 KEY DIFFERENCES CAUSING ISSUES

### 1. **Environment Detection**
```javascript
// Current logic in api.js
if (process.env.NODE_ENV === 'development') {
  return 'http://localhost:5000';  // LOCAL
} else {
  return 'https://learnonai.com';  // PRODUCTION
}
```

**ISSUE**: `NODE_ENV` might not be set correctly in production build

### 2. **URL Configuration Issues**

| Environment | Expected | Actual Issue |
|-------------|----------|--------------|
| **Local** | `http://localhost:5000/api` | ✅ Works |
| **Production** | `https://learnonai.com/api` | ❌ May fail due to nginx routing |

### 3. **Nginx Routing Conflicts**

**Problem**: Nginx has specific routing rules that might conflict:
- `/api/` → Backend (Port 5000)
- `/uploads/` → Backend uploads
- `/` → Client website (Port 3001)
- `/policies` → May conflict with static files

### 4. **CORS Configuration**

**Local**: Direct API calls work
**Production**: Goes through nginx proxy with additional CORS headers

### 5. **Build Process Differences**

| Aspect | Local | Production |
|--------|-------|------------|
| **Serving** | `npm start` (dev server) | `pm2 serve build` (static) |
| **Environment** | Development mode | Production build |
| **Hot Reload** | ✅ Enabled | ❌ Disabled |
| **Source Maps** | ✅ Enabled | ❌ Disabled |

## 🔧 SPECIFIC ISSUES TO CHECK

### 1. **Environment Variables**
```bash
# Check on EC2
echo $NODE_ENV
# Should be 'production' but might be undefined
```

### 2. **API URL Resolution**
```javascript
// Add this debug in production
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('BASE_URL:', BASE_URL);
console.log('API_URL:', API_URL);
```

### 3. **Nginx Proxy Issues**
- API calls might be getting blocked
- CORS headers might be conflicting
- SSL certificate issues

### 4. **Static File Serving**
- PM2 serve might not handle React Router correctly
- Missing SPA flag in deployment

## 🚨 COMMON PRODUCTION FAILURES

### 1. **Policies Page 500 Error**
- **Cause**: Static file conflicts with React routing
- **Solution**: Remove static policies directory, use API only

### 2. **Images Not Loading**
- **Cause**: CORS issues with nginx proxy
- **Solution**: Serve through `/api/images/` endpoint

### 3. **Login 400 Errors**
- **Cause**: API URL resolution issues
- **Solution**: Hardcode production URLs or fix environment detection

## 🔧 FIXES NEEDED

### 1. **Improve Environment Detection**
```javascript
const getBaseUrl = () => {
  // More reliable detection
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  return 'https://learnonai.com';
};
```

### 2. **Add Production Environment Variables**
```bash
# In .env.production
REACT_APP_API_URL=https://learnonai.com/api
REACT_APP_BASE_URL=https://learnonai.com
```

### 3. **Fix PM2 Serving**
```bash
# Ensure SPA flag is used
pm2 serve build 3001 --name "client" --spa
```

### 4. **Remove Static File Conflicts**
```bash
# Remove any static directories that conflict with routes
rm -rf build/policies/
rm -rf build/uploads/
```

## 📋 DEBUGGING STEPS

### 1. **Check Environment**
```bash
# On EC2
pm2 logs client --lines 50
pm2 logs api --lines 50
```

### 2. **Test API Directly**
```bash
curl https://learnonai.com/api/products
curl https://learnonai.com/api/policies
```

### 3. **Check Browser Console**
- Look for CORS errors
- Check API URL being used
- Verify network requests

### 4. **Verify Nginx**
```bash
sudo nginx -t
sudo systemctl status nginx
```

## 🎯 IMMEDIATE ACTION ITEMS

1. **Fix environment detection** in api.js
2. **Add proper .env.production** variables
3. **Ensure PM2 serves with --spa flag**
4. **Remove conflicting static directories**
5. **Test each API endpoint individually**

**ROOT CAUSE**: Environment detection and nginx routing conflicts between local and production setups.**