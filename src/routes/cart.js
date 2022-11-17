// - Express
const express = require('express');
const router = express.Router();
// - Data functions
const { getCarts, updateCarts } = require('../utils/data');

router.get('/adicionar', (req, res) => {
  return res.render('cart/add', { title: 'Carrinho' });
});

router.post('/adicionar', async (req, res) => {
  const carts = await getCarts();
  const newCarts = [...carts];

  const cart = {
    user_id: req.body.user_id,
    products: [{ id: req.body.id, quantity: req.body.quantity }],
  };

  newCarts.push(cart);

  updateCarts(newCarts, 'create');

  return res.redirect('/carrinho');
});

router.get('/', (req, res) => {
  return res.send('Carrinho de compras!');
});

module.exports = router;
