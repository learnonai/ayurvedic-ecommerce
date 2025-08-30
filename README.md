# 🌿 Ayurvedic Ecommerce System

A complete ecommerce solution for Ayurvedic medicines and products with admin panel and customer website.

## 🧹 Recently Cleaned & Optimized

**Removed unnecessary files and dependencies:**
- Removed `ftn-cht/` directory (separate payment testing project)
- Removed test files: `test-phonepe.js`, `test-phonepe-new.js`, `backend/test-phonepe-integration.js`
- Removed documentation files: `CLEANUP_GUIDE.md`, `LOCAL_VS_PROD_ANALYSIS.md`, etc.
- Removed log files and AWS deployment configs
- Removed duplicate images in `backend/sample-images/`
- Removed unused components: `GoogleSignIn.js`, `PaymentDebug.js`, `EmailVerification.js`
- Removed unused utilities: complex security, encryption, and logger files
- Removed unused dependencies: `helmet`, `joi`, `mongoose`, `nodemailer`, etc.
- Removed production environment files and GitHub Actions
- Simplified email utility to console-only mock
- Streamlined security utilities to minimal required functions

**Project is now cleaner and more maintainable!**

## ✨ Features

### 🛒 Customer Website
- **Product Catalog** with categories (Herbal Oils)
- **Search & Filter** products
- **Shopping Cart** with quantity management
- **Wishlist** functionality
- **User Registration & Login**
- **Payment Integration** (Mock Razorpay)
- **Order Tracking**
- **Product Images** display

### 👨💼 Admin Panel
- **Dashboard** with statistics
- **Product Management** (Add/Edit/Delete with image upload)
- **Order Management** (Update status)
- **User Management**
- **Image Upload** for products

### 🔧 Backend API
- **RESTful APIs** for all operations
- **JWT Authentication**
- **File Upload** support
- **JSON Database** (easily replaceable with MongoDB)
- **CORS** enabled

## 🚀 Deployment & Build Management

### Quick Deploy
```bash
# Deploy with image persistence and rollback support
./scripts/deploy.sh
```

### Build Management
```bash
# Check current build and available backups
./scripts/build-info.sh

# Rollback to previous build
./scripts/rollback.sh

# Rollback to specific build
./scripts/rollback.sh 20241201_143022_abc1234
```

### Manual Deployment
```bash
# Traditional method (not recommended)
cd /home/ec2-user/ayurvedic-ecommerce
git pull origin main
pm2 restart all
```

## 🌐 Access Applications

### 🚀 Live Production URLs
- **Customer Website**: https://learnonai.com
- **Admin Panel**: https://learnonai.com:8080
- **Backend API**: https://learnonai.com/api

### 💻 Local Development URLs
- **Customer Website**: http://localhost:3001
- **Admin Panel**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔑 Login Credentials

### Admin Panel
- Email: `admin@ayurveda.com`
- Password: `admin123`

### Test User
- Email: `test@example.com`
- Password: `password123`

## 📦 Sample Products Included

1. **Herbal Coconut Oil (100ml)** - ₹299 (Hair & skin care)
2. **Herbal Argan Oil (50ml)** - ₹599 (Anti-aging)
3. **Herbal Eucalyptus Oil (30ml)** - ₹249 (Respiratory wellness)
4. **Herbal Face Oil (30ml)** - ₹449 (Radiant skin)
5. **Herbal Lavender Oil (50ml)** - ₹349 (Stress relief)
6. **Herbal Rosemary Oil (100ml)** - ₹329 (Hair growth)

## 🛠 Tech Stack

- **Frontend**: React.js, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: JSON files (easily replaceable)
- **Authentication**: JWT tokens
- **File Upload**: Multer with persistence
- **Payment**: Mock integration (ready for Razorpay)
- **Deployment**: AWS EC2 with rollback support
- **CI/CD**: GitHub Actions + Custom Scripts
- **Process Manager**: PM2

## 📁 Project Structure (Cleaned)

```
Ayurvedic-Ecommerce/
├── backend/           # API server (simplified)
│   ├── data/          # JSON database files
│   ├── middleware/    # Auth middleware
│   ├── models/        # Data models
│   ├── routes/        # API routes
│   ├── services/      # PhonePe service
│   ├── uploads/       # Product images
│   └── utils/         # Minimal utilities
├── admin-panel/       # Admin dashboard (React)
├── client-website/    # Customer website (React)
│   ├── src/components/ # Essential components only
│   ├── src/pages/     # All main pages
│   └── src/utils/     # Minimal utilities
├── scripts/           # Deployment scripts (kept for production)
└── README.md         # This file
```

## 🔄 Build Management System

### Build ID Format
Each deployment gets a unique Build ID: `YYYYMMDD_HHMMSS_GITHASH`
Example: `20241201_143022_abc1234`

### Features
- **Image Persistence**: Uploaded images survive deployments
- **Automatic Backups**: Every deployment creates a backup
- **Easy Rollback**: Revert to any previous build
- **Build Tracking**: See all available builds and current status
- **Health Checks**: Automatic verification after deployment

### Backup Locations
- **Application Backups**: `/home/ec2-user/backups/app_backup_*.tar.gz`
- **Image Backups**: `/home/ec2-user/backups/uploads_backup_*`
- **Deployment Log**: `/home/ec2-user/backups/deployment_log.txt`

## 🔄 API Endpoints

**Base URL**: https://learnonai.com/api

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders` - Get all orders (admin)

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

### Images
- `GET /api/images/:filename` - Get uploaded images

## 🎯 Next Steps

1. **Replace JSON database** with MongoDB
2. **Add real payment gateway** (Razorpay/Stripe)
3. **Add email notifications**
4. **Implement inventory management**
5. **Add product reviews & ratings**
6. **Mobile responsive improvements**

## 🐛 Troubleshooting

### Deployment Issues
```bash
# Check build status
./scripts/build-info.sh

# View deployment logs
tail -f /home/ec2-user/backups/deployment_log.txt

# Check service status
pm2 list
pm2 logs
```

### Rollback if Issues
```bash
# Quick rollback to last working build
./scripts/rollback.sh

# Check available builds first
./scripts/build-info.sh
```

### Port Issues
```bash
# Kill processes on specific ports
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

## 🚀 CI/CD Pipeline

### Automatic Deployment
- **Trigger**: Every push to `main` branch
- **Platform**: GitHub Actions + Custom Scripts
- **Target**: EC2 instance (learnonai.com)
- **Features**: Image persistence, rollback support, build tracking

### Manual Deployment
```bash
git add .
git commit -m "Your changes"
git push origin main
# Automatic deployment will start with Build ID tracking!
```

## 💰 Infrastructure Cost
- **EC2 t3.small**: ~$16-21/month
- **GitHub Actions**: FREE (2000 min/month)
- **Storage**: Minimal cost for backups

## 📞 Support

For issues or questions:
1. Check deployment logs: `./scripts/build-info.sh`
2. View service status: `pm2 list`
3. Rollback if needed: `./scripts/rollback.sh`

---

**Managed by: SOMESH SHIVAJI NAWALE**

**Happy Selling! 🌿**