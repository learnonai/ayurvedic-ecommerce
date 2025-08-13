# 🚀 Deployment Checklist for learnonai.com

## 📋 Steps to Fix Your Deployment

### 1. **Update Nginx Configuration**
```bash
# On your EC2 server, replace nginx config
sudo cp /path/to/nginx-http.conf /etc/nginx/sites-available/learnonai.com
sudo ln -sf /etc/nginx/sites-available/learnonai.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. **Deploy Updated Code**
```bash
# Push your changes
git add .
git commit -m "Fix nginx routing and API configuration"
git push origin main
```

### 3. **On EC2 Server - Restart Services**
```bash
# Stop existing PM2 processes
pm2 delete all

# Run the updated start script
cd /home/ec2-user/ayurvedic-ecommerce
chmod +x scripts/start_application.sh
./scripts/start_application.sh

# Check PM2 status
pm2 status
pm2 logs
```

### 4. **Test the Routes**
- **API**: http://learnonai.com/api/products
- **Admin**: http://learnonai.com/admin
- **Client**: http://learnonai.com/

### 5. **Domain Configuration**
Make sure your domain `learnonai.com` points to your EC2 IP: `3.91.235.214`

## 🔧 Key Fixes Applied

1. **Nginx Routing**: Fixed `/admin` and `/api` path mapping
2. **React Router**: Added proper basename for admin panel
3. **CORS Headers**: Added proper CORS handling in nginx
4. **SPA Support**: Added `--spa` flag for serving React apps
5. **Build Process**: Added build step in deployment script

## 🐛 Common Issues & Solutions

### Issue: "Cannot GET /admin"
**Solution**: Make sure nginx is properly routing `/admin` to port 3000

### Issue: API calls failing
**Solution**: Check if backend is running on port 5000 and nginx is proxying `/api`

### Issue: Admin panel blank page
**Solution**: Ensure React app is built with correct `homepage` setting

## 📞 Testing Commands
```bash
# Test API
curl http://learnonai.com/api/products

# Test admin (should return HTML)
curl http://learnonai.com/admin

# Check nginx status
sudo systemctl status nginx

# Check PM2 processes
pm2 status
```