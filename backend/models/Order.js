const db = require('../db');

class Order {
  static create(orderData) {
    return db.create('orders', { 
      status: 'pending',
      paymentStatus: 'pending',
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...orderData
    });
  }
  
  static find(query = {}) {
    return db.find('orders', query);
  }
  
  static findById(id) {
    return db.findById('orders', id);
  }
  
  static findByIdAndUpdate(id, updates) {
    return db.update('orders', id, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }
}

module.exports = Order;