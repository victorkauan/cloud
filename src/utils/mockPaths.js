// - Path
const path = require('path');

module.exports = {
  mockPaths: {
    products: path.join(process.cwd(), 'products.json'),
    categories: path.join(process.cwd(), 'categories.json'),
    users: path.join(process.cwd(), 'users.json'),
    carts: path.join(process.cwd(), 'carts.json'),
  },
};
