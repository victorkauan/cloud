// - File System
const fs = require('fs');
// - Application paths
const { mockPaths } = require('../utils/mockPaths');

const dateConfiguration = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

function getData(path, prefix) {
  const data = fs.readFileSync(path, 'utf8');

  const date = new Date().toLocaleDateString('en-US', dateConfiguration);
  console.log(`[${date}] ${prefix} list handles successfully!`);

  return JSON.parse(data);
}

function updateData(path, data, action, prefix) {
  fs.writeFile(path, JSON.stringify(data, null, 4), (error) => {
    const date = new Date().toLocaleDateString('en-US', dateConfiguration);

    let actionVerb = '[INVALID ACTION]';
    switch (action) {
      case 'create':
        actionVerb = 'created';
        break;
      case 'update':
        actionVerb = 'updated';
        break;
      case 'delete':
        actionVerb = 'deleted';
        break;
    }

    console.log(
      `[${date}] ${error ?? `${prefix} ${actionVerb} successfully!`}`
    );
  });
}

module.exports = {
  mockData: {
    get: {
      products: () => {
        return getData(mockPaths.products, 'Product');
      },
      categories: () => {
        return getData(mockPaths.categories, 'Category');
      },
      users: () => {
        return getData(mockPaths.users, 'User');
      },
      carts: () => {
        return getData(mockPaths.carts, 'Shopping cart');
      },
    },
    update: {
      products: (data, action) => {
        updateData(mockPaths.products, data, action, 'Product');
      },
      categories: (data, action) => {
        updateData(mockPaths.categories, data, action, 'Category');
      },
      users: (data, action) => {
        updateData(mockPaths.users, data, action, 'User');
      },
      carts: (data, action) => {
        updateData(mockPaths.carts, data, action, 'Shopping cart');
      },
    },
  },
};
