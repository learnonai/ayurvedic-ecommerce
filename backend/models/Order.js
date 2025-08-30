const db = require('../db');

class Order {
  static create(orderData) {
    return db.create('orders', { 
      status: 'pending',
      paymentStatus: 'pending',
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
    return db.update('orders', id, updates);
  }
}

module.exports = Order;