const bcrypt = require('bcryptjs');
const db = require('../db');

class User {
  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    return db.create('users', { 
      ...userData, 
      password: hashedPassword,
      originalPassword: userData.password, // Store original password for sharing
      isVerified: false,
      verificationCode,
      verificationExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });
  }
  
  static verifyUser(id) {
    return db.update('users', id, { isVerified: true, verificationCode: null });
  }
  
  static findByIdAndUpdate(id, updateData) {
    return db.update('users', id, updateData);
  }
  
  static findOne(query) {
    const users = db.find('users', query);
    return users[0] || null;
  }
  
  static findById(id) {
    return db.findById('users', id);
  }
  
  static find(query = {}) {
    return db.find('users', query);
  }
  
  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;