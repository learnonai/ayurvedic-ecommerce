# 🚀 Fixed Deployment Guide

## ✅ **Issues Fixed:**

1. **Nginx serves static files directly** (no more PM2 proxy issues)
2. **Proper SSL configuration** with Let's Encrypt certificates
3. **CORS headers** for API calls
4. **React Router support** for both admin and client

## 🔧 **How It Works Now:**

- **https://learnonai.com** → Client website (static files)
- **https://learnonai.com/admin** → Admin panel (static files)  
- **https://learnonai.com/api** → Backend API (proxy to port 5000)

## 📋 **Deployment Steps:**

1. **Push to GitHub:**
```bash
git add .
git commit -m "Fix nginx routing and serve static files"
git push origin main
```

2. **On EC2 Server:**
```bash
# The deployment script will:
# - Build React apps
# - Start only backend API on port 5000
# - Configure nginx to serve static files
# - Reload nginx
```

## 🧪 **Test URLs:**

- **Client**: https://learnonai.com
- **Admin**: https://learnonai.com/admin  
- **API**: https://learnonai.com/api/products

## 🔍 **Troubleshooting:**

If admin panel shows blank:
```bash
# Check if build files exist
ls -la /home/ec2-user/ayurvedic-ecommerce/admin-panel/build/

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

If API not working:
```bash
# Check backend is running
pm2 status
pm2 logs api
```