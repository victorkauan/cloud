// - Path
const path = require('path');

const basicPath = path.resolve(__dirname, '..', '..', 'tmp');

module.exports = {
  mockPaths: {
    products: path.join(basicPath, 'products.json'),
    categories: path.join(basicPath, 'categories.json'),
    users: path.join(basicPath, 'users.json'),
    carts: path.join(basicPath, 'carts.json'),
  },
};
