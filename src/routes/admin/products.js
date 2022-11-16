// - Express
const express = require('express');
const router = express.Router();
// - Data functions
const {
  getProducts,
  updateProducts,
  getCategories,
} = require('../../utils/data');

// Create
router.get('/criar', (req, res) => {
  const categories = getCategories();

  res.render('admin/product/createForm', {
    title: 'Admin: Criar Produto',
    categories,
  });
});

router.post('/criar', (req, res) => {
  const products = getProducts();
  const { name, description, price, category_id: categoryId } = req.body;

  const newId = Number(products[products.length - 1].id) + 1;
  const newProduct = {
    id: String(newId),
    name,
    description,
    price,
    category_id: categoryId,
  };

  const newProducts = [...products];
  newProducts.push(newProduct);

  updateProducts(newProducts, 'create');

  res.redirect('/admin/produtos');
});

// Read
router.get('/', (req, res) => {
  const products = getProducts();
  const categories = getCategories();

  const currencyFormat = {
    minimumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  };

  products.forEach((product, index) => {
    const { category_id: categoryId } = product;
    categories.forEach((category) => {
      if (categoryId === category.id) {
        products[index]['category_name'] = category.name;
      }
    });

    products[index]['formatted_price'] = Number(product.price).toLocaleString(
      'pt-BR',
      currencyFormat
    );
  });

  res.render('admin/product/list', {
    title: 'Admin: Listar Produtos',
    products,
  });
});

// Update
router.get('/editar/:id', (req, res) => {
  const products = getProducts();
  const { id: parameterId } = req.params;

  const categories = getCategories();

  products.forEach((product) => {
    const { id } = product;

    if (parameterId === id) {
      const { name, description, price, category_id: categoryId } = product;

      for (let i = 0; i < categories.length; i += 1) {
        categories[i]['selected'] = categories[i].id === categoryId;
      }

      res.render('admin/product/editForm', {
        id: parameterId,
        name,
        description,
        price,
        categories,
        title: 'Admin: Editar Produto',
      });
    }
  });
});

router.post('/editar', (req, res) => {
  const products = getProducts();
  const { id, name, description, price, category_id: categoryId } = req.body;

  const newProducts = [...products];
  newProducts.forEach((product, index) => {
    if (id === product.id) {
      newProducts[index] = {
        id,
        name,
        description,
        price,
        category_id: categoryId,
      };

      updateProducts(newProducts, 'update');
    }
  });

  res.redirect('/admin/produtos');
});

// Delete
router.get('/deletar', (req, res) => {
  res.render('admin/product/deleteForm', { title: 'Admin: Deletar Produto' });
});

router.post('/deletar', (req, res) => {
  const products = getProducts();
  const { id } = req.body;

  let newProducts = products.filter((product) => id !== product.id);

  updateProducts(newProducts, 'delete');

  res.redirect('/admin/produtos');
});

module.exports = router;
