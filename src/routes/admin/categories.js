// - Express
const express = require('express');
const router = express.Router();
// - Data functions
const { getCategories, updateCategories } = require('../../utils/data');

// Create
router.get('/criar', (req, res) => {
  res.render('admin/category/createForm', { title: 'Admin: Criar Categoria' });
});

router.post('/criar', (req, res) => {
  const categories = getCategories();
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

// Read
router.get('/', (req, res) => {
  const categories = getCategories();
  res.render('admin/category/list', {
    title: 'Admin: Listar Categorias',
    categories,
  });
});

// Update
router.get('/editar/:id', (req, res) => {
  const categories = getCategories();
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

router.post('/editar', (req, res) => {
  const categories = getCategories();
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

// Delete
router.get('/deletar', (req, res) => {
  res.render('admin/category/deleteForm', {
    title: 'Admin: Deletar Categoria',
  });
});

router.post('/deletar', (req, res) => {
  const categories = getCategories();
  const { id } = req.body;

  const newCategories = categories.filter((category) => id !== category.id);

  updateCategories(newCategories, 'delete');

  res.redirect('/admin/categorias');
});

module.exports = router;
