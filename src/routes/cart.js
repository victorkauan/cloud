// - Express
const express = require('express');
const router = express.Router();
// - Data functions
const { mockData } = require('../services/mockData');

router.get('/adicionar', (req, res) => {
  return res.render('cart/add', { title: 'Carrinho' });
});

router.post('/adicionar', async (req, res) => {
  const carts = await mockData.get.carts();
  const newCarts = [...carts];

  const cart = {
    user_id: req.body.user_id,
    products: [{ id: req.body.id, quantity: req.body.quantity }],
  };

  newCarts.push(cart);

  mockData.update.carts(newCarts, 'create');

  return res.redirect('/carrinho');
});

router.get('/', (req, res) => {
  return res.send('Carrinho de compras!');
});

module.exports = router;
