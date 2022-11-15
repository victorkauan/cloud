// - File System
const fs = require('fs');
// - Application paths
const { paths } = require('../utils/paths');

const dateConfiguration = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

function updateData(path, data, action, prefix) {
  fs.writeFile(path, JSON.stringify(data, null, 4), (error) => {
    const date = new Date().toLocaleDateString('en-US', dateConfiguration);

    actionVerb =
      action === 'create'
        ? 'created'
        : action === 'update'
        ? 'updated'
        : action === 'delete'
        ? 'deleted'
        : '[INVALID ACTION]';

    console.log(
      `[${date}] ${error ?? `${prefix} ${actionVerb} successfully!`}`
    );
  });
}

module.exports = {
  updateProducts: (data, action) => {
    updateData(paths.products, data, action, 'Product');
  },
  updateCategories: (data, action) => {
    updateData(paths.categories, data, action, 'Category');
  },
  updateUsers: (data, action) => {
    updateData(paths.users, data, action, 'User');
  },
};
