# 🔧 Local Development vs Production Guide

## 🏠 **Local Development**

### Start Local Development:
```bash
# Use the start-all.sh script for local development
./start-all.sh
```

### Local URLs:
- **Client**: http://localhost:3001
- **Admin**: http://localhost:3000  
- **API**: http://localhost:5000

### Local Environment Variables:
- `NODE_ENV=development` (automatically set by npm start)
- API calls go to `http://localhost:5000/api`

---

## 🚀 **Production Deployment**

### Deploy to Production:
```bash
# Push to main branch - auto-deploys via CI/CD
git add .
git commit -m "Your changes"
git push origin main
```

### Production URLs:
- **Client**: https://learnonai.com
- **Admin**: https://learnonai.com:8080
- **API**: https://learnonai.com/api

### Production Environment:
- `NODE_ENV=production` (set by build process)
- API calls go to `https://learnonai.com/api`
- Admin runs on port 3002 internally, proxied to 8080
- Client runs on port 3001 internally, proxied to 443

---

## 🔄 **How It Works**

### API Configuration:
The `src/utils/api.js` files automatically detect the environment:

```javascript
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';  // Local
  }
  return 'https://learnonai.com/api';    // Production
};
```

### Image URLs:
- **Local**: `http://localhost:5000/uploads/image.jpg`
- **Production**: `https://learnonai.com/uploads/image.jpg`

---

## 📝 **Testing Workflow**

1. **Test Locally First**:
   ```bash
   ./start-all.sh
   # Test at http://localhost:3001
   ```

2. **Deploy to Production**:
   ```bash
   git add .
   git commit -m "Feature: Add new products"
   git push origin main
   ```

3. **Verify Production**:
   - Client: https://learnonai.com
   - Admin: https://learnonai.com:8080

---

## 🔑 **Login Credentials** (Both Local & Production):
- **Admin**: admin@ayurveda.com / admin123
- **Test User**: test@example.com / password123