// Libraries
// - Express
const express = require('express');
const app = express();
const PORT = 3001;
// - Handlebars
const { engine } = require('express-handlebars');
// - Path
const path = require('path');

// Configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', engine());

// Routes
app.get('/', (req, res) => {
  const message = 'Hello, world!';
  res.render('index', { title: 'Application', message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
