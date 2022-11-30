// - Express
const express = require('express');
const router = express.Router();
// - Data functions
const { mockData } = require('../../services/mockData');

// Create
router.get('/criar', (req, res) => {
  return res.render('admin/category/createForm', {
    title: 'Admin: Criar Categoria',
  });
});

router.post('/criar', async (req, res) => {
  const categories = await mockData.get.categories();
  const categoryName = req.body.name;

  const newCategory = {
    id: String(Number(categories[categories.length - 1].id) + 1),
    name: categoryName,
  };

  const newCategories = [...categories];
  newCategories.push(newCategory);

  mockData.update.categories(newCategories, 'create');

  return res.redirect('/admin/categorias');
});

// Read
router.get('/', async (req, res) => {
  const categories = await mockData.get.categories();
  return res.render('admin/category/list', {
    title: 'Admin: Listar Categorias',
    categories,
  });
});

// Update
router.get('/editar/:id', async (req, res) => {
  const categories = await mockData.get.categories();
  const { id: parameter_id } = req.params;

  categories.forEach((category) => {
    if (parameter_id === category.id) {
      const { id, name } = category;
      res.render('admin/category/editForm', {
        id,
        name,
        title: 'Admin: Editar Categoria',
      });
    }
  });
});

router.post('/editar', async (req, res) => {
  const categories = await mockData.get.categories();
  const { id, name } = req.body;

  const newCategories = [...categories];
  newCategories.forEach((category, index) => {
    if (id === category.id) {
      newCategories[index] = { id, name };

      mockData.update.categories(newCategories, 'update');
    }
  });

  return res.redirect('/admin/categorias');
});

// Delete
router.get('/deletar', (req, res) => {
  return res.render('admin/category/deleteForm', {
    title: 'Admin: Deletar Categoria',
  });
});

router.post('/deletar', async (req, res) => {
  const categories = await mockData.get.categories();
  const { id } = req.body;

  const newCategories = categories.filter((category) => id !== category.id);

  mockData.update.categories(newCategories, 'delete');

  return res.redirect('/admin/categorias');
});

module.exports = router;
