// - Express
const express = require('express');
const router = express.Router();

// Middlewares
const authMiddleware = require('../../middlewares/auth');

router.use(authMiddleware);

// Routes
const products = require('./products');
const categories = require('./categories');

router.get('/', (req, res) => {
  return res.render('admin/panel', { title: 'Painel Administrativo' });
});

router.use('/produtos', products); // Products
router.use('/categorias', categories); // Categories

module.exports = router;
