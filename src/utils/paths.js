// - Paths
const path = require('path');

// Mock data paths
module.exports = {
  paths: {
    products: path.join(__dirname, '..', 'data', 'products.json'),
    categories: path.join(__dirname, '..', 'data', 'categories.json'),
    users: path.join(__dirname, '..', 'data', 'users.json'),
  },
};
