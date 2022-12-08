// - Express
const express = require('express');
const router = express.Router();
// - Data functions
const { mockData } = require('../services/mockData');
// - Formats
const { currencyFormat } = require('../utils/formats');

// Middlewares
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/adicionar', (req, res) => {
  return res.render('cart/createForm', { title: 'Carrinho' });
});

router.post('/adicionar', async (req, res) => {
  const carts = await mockData.get.carts();
  const newCarts = [...carts];

  const { id } = req.session.user;
  const { id: product_id, quantity } = req.body;

  if (Number(quantity) > 0) {
    const cart = {
      user_id: id,
      products: [{ id: product_id, quantity }],
    };
    newCarts.push(cart);

    mockData.update.carts(newCarts, 'create');
  }

  return res.redirect('/');
});

router.get('/', async (req, res) => {
  const users = await mockData.get.users();
  const carts = await mockData.get.carts();
  const products = await mockData.get.products();

  if (users.length === 0) {
    return res.redirect('/');
  }

  const { id } = req.session.user;
  const { favorite_ids } = users.find((user) => user.id === id);

  const userCarts = carts.filter((cart) => cart.user_id === id);
  const cartProducts = [];
  let total = 0;

  userCarts.forEach((cart) => {
    cart.products.forEach((cartProduct) => {
      const userProduct = products.find(
        (product) => product.id === cartProduct.id
      );
      total += Number(userProduct.price) * Number(cartProduct.quantity);

      cartProducts.push({
        ...userProduct,
        quantity: cartProduct.quantity,
      });
    });
  });

  total = total.toLocaleString('pt-BR', currencyFormat);

  cartProducts.forEach((product, index) => {
    cartProducts[index]['formatted_price'] = Number(
      product.price
    ).toLocaleString('pt-BR', currencyFormat);

    if (favorite_ids.includes(product.id)) {
      cartProducts[index]['favorited'] = true;
    }
  });

  console.log(cartProducts);

  return res.render('cart/list', { cartProducts, total });
});

module.exports = router;
