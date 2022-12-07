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

router.post('/favoritar', async (req, res) => {
  const users = await mockData.get.users();
  const newUsers = [...users];

  const { product_id } = req.body;
  const { id } = req.session.user;

  newUsers.forEach((user, index) => {
    if (user.id === id) {
      if (user.favorite_ids.includes(product_id)) {
        const { favorite_ids } = newUsers[index];
        const newFavoriteIds = favorite_ids.filter(
          (favoriteId) => favoriteId !== product_id
        );
        newUsers[index].favorite_ids = newFavoriteIds;
      } else {
        newUsers[index].favorite_ids.push(product_id);
      }

      mockData.update.users(newUsers, 'update');
    }
  });

  return res.redirect('/');
});

router.get('/', async (req, res) => {
  const users = await mockData.get.users();
  const products = await mockData.get.products();

  const { id } = req.session.user;
  const { favorite_ids } = users.find((user) => user.id === id);

  const favoriteProducts = products.filter((product) =>
    favorite_ids.includes(product.id)
  );

  favoriteProducts.forEach((product, index) => {
    favoriteProducts[index]['formatted_price'] = Number(
      product.price
    ).toLocaleString('pt-BR', currencyFormat);

    if (favorite_ids.includes(product.id)) {
      favoriteProducts[index]['favorited'] = true;
    }
  });

  return res.render('favorites/list', { favoriteProducts });
});

module.exports = router;
