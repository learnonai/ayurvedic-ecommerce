const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data');
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

const collections = {
  users: path.join(dbPath, 'users.json'),
  products: path.join(dbPath, 'products.json'),
  orders: path.join(dbPath, 'orders.json'),
  wishlist: path.join(dbPath, 'wishlist.json')
};

// Initialize collections if they don't exist
Object.values(collections).forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
});

// Initialize files if they don't exist
Object.values(collections).forEach(file => {
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
});

const db = {
  read: (collection) => {
    const data = fs.readFileSync(collections[collection], 'utf8');
    return JSON.parse(data);
  },
  
  write: (collection, data) => {
    fs.writeFileSync(collections[collection], JSON.stringify(data, null, 2));
  },
  
  find: (collection, query = {}) => {
    const data = db.read(collection);
    if (Object.keys(query).length === 0) return data;
    
    return data.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  },
  
  findById: (collection, id) => {
    const data = db.read(collection);
    return data.find(item => item._id === id);
  },
  
  create: (collection, item) => {
    const data = db.read(collection);
    item._id = Date.now().toString();
    item.createdAt = new Date();
    item.updatedAt = new Date();
    data.push(item);
    db.write(collection, data);
    return item;
  },
  
  update: (collection, id, updates) => {
    const data = db.read(collection);
    const index = data.findIndex(item => item._id === id);
    if (index === -1) return null;
    
    // Ensure the updates are properly merged
    Object.keys(updates).forEach(key => {
      data[index][key] = updates[key];
    });
    data[index].updatedAt = new Date();
    
    db.write(collection, data);
    return data[index];
  },
  
  delete: (collection, id) => {
    const data = db.read(collection);
    const filtered = data.filter(item => item._id !== id);
    db.write(collection, filtered);
    return true;
  }
};

module.exports = db;