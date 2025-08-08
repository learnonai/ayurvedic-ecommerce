# 🗄️ Database Migration Plan: JSON to MongoDB

## 📊 **When to Migrate**

### **Migration Triggers:**
- **100+ orders/day** - Start planning
- **300+ orders/day** - Migrate immediately  
- **Response time > 2 seconds** - Critical
- **File size > 10MB** - Performance issues
- **Multiple concurrent users** - Data corruption risk

---

## 🚀 **Migration Options**

### **Option 1: MongoDB Atlas (Recommended)**
- **Cost**: $9-15/month
- **Setup**: 15 minutes
- **Maintenance**: Zero
- **Scaling**: Automatic

### **Option 2: Self-hosted MongoDB on EC2**
- **Cost**: $0 (same EC2)
- **Setup**: 2 hours
- **Maintenance**: Manual
- **Risk**: Single point of failure

### **Option 3: AWS DocumentDB**
- **Cost**: $25-50/month
- **Setup**: 30 minutes
- **Maintenance**: AWS managed
- **Enterprise**: High availability

---

## 📋 **Pre-Migration Checklist**

### **1. Backup Current Data**
```bash
# Create full backup
cd /home/ec2-user/ayurvedic-ecommerce/backend
tar -czf data-backup-$(date +%Y%m%d).tar.gz data/
cp data-backup-*.tar.gz ~/backups/
```

### **2. Analyze Current Data**
```bash
# Check file sizes
ls -lh data/*.json

# Count records
wc -l data/*.json

# Check data structure
head -20 data/users.json
```

### **3. Test Environment Setup**
- Create staging environment
- Test migration with sample data
- Verify all APIs work

---

## 🛠️ **Step-by-Step Migration**

### **Phase 1: Setup MongoDB (30 minutes)**

#### **1.1 Create MongoDB Atlas Account**
1. Go to https://www.mongodb.com/atlas
2. Sign up for free account
3. Create new cluster (M0 - Free tier)
4. Create database user
5. Whitelist IP addresses
6. Get connection string

#### **1.2 Install MongoDB Dependencies**
```bash
# On your EC2 instance
cd /home/ec2-user/ayurvedic-ecommerce/backend
npm install mongoose mongodb
```

### **Phase 2: Create Database Models (45 minutes)**

#### **2.1 Create Models Directory**
```bash
mkdir models/mongodb
```

#### **2.2 User Model**
```javascript
// models/mongodb/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

#### **2.3 Product Model**
```javascript
// models/mongodb/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String,
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
```

#### **2.4 Order Model**
```javascript
// models/mongodb/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: String,
  paymentMethod: String,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
```

### **Phase 3: Create Migration Scripts (60 minutes)**

#### **3.1 Database Connection**
```javascript
// config/mongodb.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

#### **3.2 Migration Script**
```javascript
// scripts/migrate-to-mongodb.js
const fs = require('fs');
const mongoose = require('mongoose');
const User = require('../models/mongodb/User');
const Product = require('../models/mongodb/Product');
const Order = require('../models/mongodb/Order');

async function migrateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Migrate Users
    const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
    for (const user of users) {
      await User.create({
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin || false,
        createdAt: user.createdAt || new Date()
      });
    }
    console.log(`Migrated ${users.length} users`);

    // Migrate Products
    const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'));
    for (const product of products) {
      await Product.create({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock || 0,
        createdAt: product.createdAt || new Date()
      });
    }
    console.log(`Migrated ${products.length} products`);

    // Migrate Orders
    const orders = JSON.parse(fs.readFileSync('./data/orders.json', 'utf8'));
    for (const order of orders) {
      // Find user by email to get ObjectId
      const user = await User.findOne({ email: order.userEmail });
      if (user) {
        await Order.create({
          userId: user._id,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status || 'pending',
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus || 'pending',
          createdAt: order.createdAt || new Date()
        });
      }
    }
    console.log(`Migrated ${orders.length} orders`);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();
```

### **Phase 4: Update API Routes (90 minutes)**

#### **4.1 Update User Routes**
```javascript
// routes/users-mongodb.js
const express = require('express');
const User = require('../models/mongodb/User');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

### **Phase 5: Environment Configuration (15 minutes)**

#### **5.1 Update .env File**
```bash
# Add to .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurvedic-ecommerce
DATABASE_TYPE=mongodb
```

#### **5.2 Update server.js**
```javascript
// Add to server.js
const connectDB = require('./config/mongodb');

if (process.env.DATABASE_TYPE === 'mongodb') {
  connectDB();
}
```

---

## 🧪 **Testing Phase (60 minutes)**

### **1. Data Integrity Tests**
```bash
# Compare record counts
node scripts/compare-data.js

# Test API endpoints
curl http://localhost:5000/api/users
curl http://localhost:5000/api/products
curl http://localhost:5000/api/orders
```

### **2. Performance Tests**
```bash
# Load testing
npm install -g artillery
artillery quick --count 100 --num 10 http://localhost:5000/api/products
```

### **3. Backup Verification**
```bash
# Verify MongoDB backup
mongodump --uri="mongodb+srv://..." --out=./mongodb-backup
```

---

## 🚀 **Go-Live Process (30 minutes)**

### **1. Maintenance Mode**
```bash
# Put site in maintenance mode
pm2 stop all
```

### **2. Final Data Sync**
```bash
# Run migration script
node scripts/migrate-to-mongodb.js
```

### **3. Switch to MongoDB**
```bash
# Update environment
export DATABASE_TYPE=mongodb

# Restart services
pm2 start all
```

### **4. Verify Everything Works**
```bash
# Test all endpoints
curl http://3.91.235.214:5000/api/products
curl http://3.91.235.214:5000/api/users
```

---

## 📊 **Post-Migration Monitoring**

### **Performance Metrics**
- Response times < 200ms
- Database connection pool usage
- Memory usage reduction
- Concurrent user handling

### **Data Monitoring**
- Daily backup verification
- Data consistency checks
- Error rate monitoring

---

## 🔄 **Rollback Plan**

### **If Migration Fails:**
1. **Stop MongoDB services**
2. **Restore JSON files from backup**
3. **Revert environment variables**
4. **Restart with JSON database**

### **Rollback Script**
```bash
#!/bin/bash
# rollback.sh
pm2 stop all
export DATABASE_TYPE=json
cp ~/backups/data-backup-*.tar.gz ./
tar -xzf data-backup-*.tar.gz
pm2 start all
echo "Rollback completed"
```

---

## 💰 **Cost Analysis**

### **MongoDB Atlas Pricing**
- **M0 (Free)**: 512MB storage, good for testing
- **M2 ($9/month)**: 2GB storage, 100 connections
- **M5 ($25/month)**: 5GB storage, 200 connections

### **Performance Gains**
- **10x faster** queries with indexing
- **100x more** concurrent users
- **Unlimited** data growth
- **Zero** data corruption risk

---

## 🎯 **Success Metrics**

### **Before Migration (JSON)**
- Max 300 orders/day
- Response time: 2-5 seconds
- Concurrent users: 10-20
- Data risk: High

### **After Migration (MongoDB)**
- Max 10,000+ orders/day
- Response time: 50-200ms
- Concurrent users: 500+
- Data risk: Minimal

---

## 📞 **Support & Resources**

### **Documentation**
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/)
- [Migration Best Practices](https://docs.mongodb.com/manual/core/data-modeling-introduction/)

### **Emergency Contacts**
- MongoDB Support: Available 24/7 with paid plans
- AWS Support: Available with support plan

---

**🎉 Ready to scale your Ayurvedic Ecommerce to the next level!**

*This migration will future-proof your application for thousands of daily orders and users.*