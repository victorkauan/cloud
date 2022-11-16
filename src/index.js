// - Express
const express = require('express');
const app = express();
const PORT = 3001;
// - Handlebars
const { engine } = require('express-handlebars');
// - Path
const path = require('path');
// - Data functions
const { getProducts } = require('./utils/data');

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

// Routes
const admin = require('./routes/admin');
const cart = require('./routes/cart');

app.get('/', (req, res) => {
  const products = getProducts();

  const currencyFormat = {
    minimumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  };

  products.forEach((product, index) => {
    products[index]['formatted_price'] = Number(product.price).toLocaleString(
      'pt-BR',
      currencyFormat
    );
  });

  res.render('index', { products, title: 'Página Inicial' });
});

app.use('/admin', admin); // - Admin
app.use('/carrinho', cart); // - Shopping cart

app.listen(process.env.PORT ?? PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
