# 🌿 Ayurvedic Ecommerce System

A complete ecommerce solution for Ayurvedic medicines and products with admin panel and customer website.

## ✨ Features

### 🛒 Customer Website
- **Product Catalog** with categories (Medicines, Jadi Buti, Oils, Powders, Tablets)
- **Search & Filter** products
- **Shopping Cart** with quantity management
- **Wishlist** functionality
- **User Registration & Login**
- **Payment Integration** (Mock Razorpay)
- **Order Tracking**
- **Product Images** display

### 👨‍💼 Admin Panel
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

## 🚀 Quick Start

### Option 1: Start All Services at Once
```bash
./start-all.sh
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Admin Panel  
cd admin-panel && npm install && npm start

# Terminal 3 - Client Website
cd client-website && npm install && BROWSER=none PORT=3001 npm start
```

## 🌐 Access Applications

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

1. **Ashwagandha Powder** - ₹299 (Stress relief)
2. **Triphala Churna** - ₹199 (Digestion)
3. **Brahmi Oil** - ₹399 (Hair growth)
4. **Chyawanprash** - ₹599 (Immunity)
5. **Giloy Tablets** - ₹249 (Immunity booster)
6. **Neem Powder** - ₹179 (Blood purification)

## 🛠 Tech Stack

- **Frontend**: React.js, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Database**: JSON files (easily replaceable)
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Payment**: Mock integration (ready for Razorpay)

## 📁 Project Structure

```
Ayurvedic-Ecommerce/
├── backend/           # API server
├── admin-panel/       # Admin dashboard
├── client-website/    # Customer website
├── start-all.sh      # Quick start script
└── README.md         # This file
```

## 🔄 API Endpoints

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

### Payment
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment

## 🎯 Next Steps

1. **Replace JSON database** with MongoDB
2. **Add real payment gateway** (Razorpay/Stripe)
3. **Add email notifications**
4. **Implement inventory management**
5. **Add product reviews & ratings**
6. **Mobile responsive improvements**

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill processes on specific ports
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Dependencies Issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For issues or questions, check the console logs in each terminal window for detailed error messages.

---

**Happy Selling! 🌿**