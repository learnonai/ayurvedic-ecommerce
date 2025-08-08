const db = require('../db');

class Product {
  static create(productData) {
    return db.create('products', { ...productData, isActive: true });
  }
  
  static find(query = {}) {
    return db.find('products', query);
  }
  
  static findById(id) {
    return db.findById('products', id);
  }
  
  static findByIdAndUpdate(id, updates) {
    return db.update('products', id, updates);
  }
  
  static findByIdAndDelete(id) {
    return db.delete('products', id);
  }
  
  static delete(id) {
    return db.update('products', id, { isActive: false });
  }
}

module.exports = Product;