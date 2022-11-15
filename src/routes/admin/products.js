// - Express
const express = require('express');
const router = express.Router();
// - Data functions
const { getProducts, updateProducts } = require('../../utils/data');

// Create
router.get('/criar', (req, res) => {
  res.render('admin/product/create_form', { title: 'ADM : Criar Produto' });
});

router.post('/criar', (req, res) => {
  const products = getProducts();
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

// Read
router.get('/', (req, res) => {
  const products = getProducts();
  res.render('admin/product/list', {
    title: 'ADM : Listar Produtos',
    products,
  });
});

// Update
router.get('/editar/:id', (req, res) => {
  const products = getProducts();
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

router.post('/editar', (req, res) => {
  const products = getProducts();
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

// Delete
router.get('/deletar', (req, res) => {
  res.render('admin/product/delete_form', { title: 'ADM : Deletar Produto' });
});

router.post('/deletar', (req, res) => {
  const products = getProducts();
  const { id } = req.body;

  let newProducts = products.filter((product) => id !== product.id);

  updateProducts(newProducts, 'delete');

  res.redirect('/admin/produtos');
});

module.exports = router;
