// - Express
const express = require('express');
const router = express.Router();
// - Application paths
const { paths } = require('../utils/paths');
// - Update data
const {
  updateProducts,
  updateCategories,
  updateUsers,
} = require('../utils/updateData');

// Panel
router.get('/', (req, res) => {
  res.render('admin/panel', { title: 'Painel Administrativo' });
});

// Product
// - Create
router.get('/produtos/criar', (req, res) => {
  res.render('admin/product/create_form', { title: 'ADM : Criar Produto' });
});

router.post('/produtos/criar', (req, res) => {
  const products = require(paths.products);
  const { name, description, price, tag } = req.body;

  const newId = Number(products[products.length - 1].id) + 1;
  const newProduct = {
    id: String(newId),
    name,
    description,
    price,
    tag,
  };

  const newProducts = [...products];
  newProducts.push(newProduct);

  updateProducts(newProducts, 'create');

  res.redirect('/admin/produtos');
});

// - Read
router.get('/produtos', (req, res) => {
  const products = require(paths.products);
  res.render('admin/product/list', {
    title: 'ADM : Listar Produtos',
    products,
  });
});

// - Update
router.get('/produtos/editar/:id', (req, res) => {
  const products = require(paths.products);
  const { id: parameter_id } = req.params;

  products.forEach((product) => {
    const { id } = product;

    if (parameter_id == id) {
      const { name, description, price, tag } = product;
      res.render('admin/product/edit_form', {
        id: parameter_id,
        name,
        description,
        price,
        tag,
        title: 'ADM : Editar Produto',
      });
    }
  });
});

router.post('/produtos/editar', (req, res) => {
  const products = require(paths.products);
  const { id, name, description, price, tag } = req.body;

  const newProducts = [...products];
  newProducts.forEach((product, index) => {
    if (id === product.id) {
      newProducts[index] = { id, name, description, price, tag };

      updateProducts(newProducts, 'update');
    }
  });

  res.redirect('/admin/produtos');
});

// - Delete
router.get('/produtos/deletar', (req, res) => {
  res.render('admin/product/delete_form', { title: 'ADM : Deletar Produto' });
});

router.post('/produtos/deletar', (req, res) => {
  const products = require(paths.products);
  const { id } = req.body;

  let newProducts = products.filter((product) => id !== product.id);

  updateProducts(newProducts, 'delete');

  res.redirect('/admin/produtos');
});

// Category
// - Create
router.get('/categorias/criar', (req, res) => {
  res.render('admin/category/create_form', { title: 'ADM : Criar Categoria' });
});

router.post('/categorias/criar', (req, res) => {
  const categories = require(paths.categories);
  const categoryName = req.body.name;

  const newId = Number(categories[categories.length - 1].id) + 1;

  const newCategory = {
    id: String(newId),
    name: categoryName,
  };

  const newCategories = [...categories];
  newCategories.push(newCategory);

  updateCategories(newCategories, 'create');

  res.redirect('/admin/categorias');
});

// - Read
router.get('/categorias', (req, res) => {
  const categories = require(paths.categories);
  res.render('admin/category/list', {
    title: 'ADM : Listar Categorias',
    categories,
  });
});

// - Update
router.get('/categorias/editar/:id', (req, res) => {
  const categories = require(paths.categories);
  const { id: parameter_id } = req.params;

  categories.forEach((category) => {
    if (parameter_id === category.id) {
      const { id, name } = category;
      res.render('admin/category/edit_form', {
        id,
        name,
        title: 'ADM : Editar Categoria',
      });
    }
  });
});

router.post('/categorias/editar', (req, res) => {
  const categories = require(paths.categories);
  const { id, name } = req.body;

  const newCategories = [...categories];
  newCategories.forEach((category, index) => {
    if (id === category.id) {
      newCategories[index] = { id, name };

      updateCategories(newCategories, 'update');
    }
  });

  res.redirect('/admin/categorias');
});

// - Delete
router.get('/categorias/deletar', (req, res) => {
  res.render('admin/category/delete_form', {
    title: 'ADM : Deletar Categoria',
  });
});

router.post('/categorias/deletar', (req, res) => {
  const categories = require(paths.categories);
  const { id } = req.body;

  const newCategories = categories.filter((category) => id !== category.id);

  updateCategories(newCategories, 'delete');

  res.redirect('/admin/categorias');
});

module.exports = router;
