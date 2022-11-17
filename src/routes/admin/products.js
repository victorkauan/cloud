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
router.get('/criar', async (req, res) => {
  const categories = await getCategories();

  return res.render('admin/product/createForm', {
    title: 'Admin: Criar Produto',
    categories,
  });
});

router.post('/criar', async (req, res) => {
  const products = await getProducts();
  const { name, description, price, category_id: categoryId } = req.body;

  const newProduct = {
    id: String(Number(products[products.length - 1].id) + 1),
    name,
    description,
    price,
    category_id: categoryId,
  };

  const newProducts = [...products];
  newProducts.push(newProduct);

  updateProducts(newProducts, 'create');

  return res.redirect('/admin/produtos');
});

// Read
router.get('/', async (req, res) => {
  const products = await getProducts();
  const categories = await getCategories();

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

  return res.render('admin/product/list', {
    title: 'Admin: Listar Produtos',
    products,
  });
});

// Update
router.get('/editar/:id', async (req, res) => {
  const products = await getProducts();
  const categories = await getCategories();

  const { id: parameterId } = req.params;

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

router.post('/editar', async (req, res) => {
  const products = await getProducts();
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

  return res.redirect('/admin/produtos');
});

// Delete
router.get('/deletar', (req, res) => {
  return res.render('admin/product/deleteForm', {
    title: 'Admin: Deletar Produto',
  });
});

router.post('/deletar', async (req, res) => {
  const products = await getProducts();
  const { id } = req.body;

  let newProducts = products.filter((product) => id !== product.id);

  updateProducts(newProducts, 'delete');

  return res.redirect('/admin/produtos');
});

module.exports = router;
