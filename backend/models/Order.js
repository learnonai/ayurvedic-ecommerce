const db = require('../db');

class Order {
  static create(orderData) {
    return db.create('orders', { ...orderData, status: 'pending', paymentStatus: 'pending' });
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