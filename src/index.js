// - Express
const express = require('express');
const app = express();
const PORT = 3001;
// - Handlebars
const { engine } = require('express-handlebars');
// - Path
const path = require('path');
// - Express session
const session = require('cookie-session');
// - Secret
const authConfig = require('./configuration/auth.json');
// - Data functions
const { mockData } = require('./services/mockData');
// - Formats
const { currencyFormat } = require('./utils/formats');
// - Routes
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const cart = require('./routes/cart');
const favorite = require('./routes/favorite');

// Configurations
// - Handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', engine());
// - Static files
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'dist')));
// - Form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// - Session
app.use(
  session({
    secret: authConfig.secret,
    resave: false,
    saveUninitialized: false,
  })
);

// Middlewares
// - Global variables
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.get('/', async (req, res) => {
  const users = await mockData.get.users();
  const carts = await mockData.get.carts();
  const products = await mockData.get.products();

  let favorite_ids = [];
  let userCartProductsIds = [];
  if (req.session.user) {
    const { id } = req.session.user;
    const authUser = users.find((user) => user.id === id);

    favorite_ids = authUser.favorite_ids ?? [];

    userCarts = carts.filter((cart) => cart.user_id === id);
    userCarts.forEach((userCart) => {
      userCart.products.forEach((product) => {
        userCartProductsIds.push(product.id);
      });
    });
  }

  products.forEach((product, index) => {
    products[index]['formatted_price'] = Number(product.price).toLocaleString(
      'pt-BR',
      currencyFormat
    );

    if (favorite_ids.includes(product.id)) {
      products[index]['favorited'] = true;
    }

    if (userCartProductsIds.includes(product.id)) {
      products[index]['bought'] = true;
    }
  });

  return res.render('index', { products, title: 'Fit Shop' });
});

app.use('/conta', auth); // - Authentication
app.use('/admin', admin); // - Admin
app.use('/carrinho', cart); // - Shopping cart
app.use('/favoritos', favorite); // - Favorite list

app.listen(process.env.PORT ?? PORT, () => {
  return console.log(`Server is running on port ${PORT}!`);
});
