require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const paymentRoutes = require('./routes/payment');
const smsRoutes = require('./routes/sms');
const userRoutes = require('./routes/users');
const imageRoutes = require('./routes/images');
const policyRoutes = require('./routes/policies');
const categoryRoutes = require('./routes/categories');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/pdt-img', express.static('pdt-img'));

app.get('/', (req, res) => {
  res.json({ message: 'Herbal Ecommerce API is running!', status: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/categories', categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});