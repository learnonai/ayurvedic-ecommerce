# 🖼️ Product Images Deployment Guide

## How It Works Now:

### 📁 **pdt-img Folder System:**
- All product images are stored in `backend/pdt-img/`
- Images uploaded via admin panel go directly to `pdt-img/`
- Images persist across deployments (never get deleted)
- Both sample images and uploaded images are in the same folder

### 🔄 **Deployment Process:**

**On EC2, run these commands:**

```bash
# 1. Setup pdt-img folder (one-time setup)
cd /home/ec2-user/ayurvedic-ecommerce
mkdir -p backend/pdt-img
cp backend/sample-images/* backend/pdt-img/

# 2. Regular deployment (keeps uploaded images)
cd /home/ec2-user/ayurvedic-ecommerce && git pull origin main && cd backend && pm2 restart api && cd ../client-website && npm run build && pm2 restart client && cd ../admin-panel && npm run build && pm2 restart admin-panel
```

### ✅ **What This Achieves:**

1. **Persistent Images**: Uploaded images never get lost during deployment
2. **Single Source**: All images (sample + uploaded) in one folder
3. **Admin Uploads**: New images from admin panel go to `pdt-img/`
4. **Recently Viewed**: Shows actual product images instead of leaf icons
5. **No Manual Copy**: No need to copy images after each deployment

### 🎯 **Image URLs:**
- **API**: `https://learnonai.com/api/images/filename.jpg`
- **Direct**: `https://learnonai.com/pdt-img/filename.jpg`

### 📋 **Admin Panel Workflow:**
1. Admin uploads product image
2. Image saves to `backend/pdt-img/`
3. Product references `pdt-img/filename.jpg`
4. Image shows everywhere (products, recently viewed, etc.)
5. Deployment doesn't affect uploaded images

**No more image loss on deployment! 🎉**