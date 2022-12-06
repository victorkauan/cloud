// - Express
const express = require("express");
const app = express();
const PORT = 3001;
// - Handlebars
const { engine } = require("express-handlebars");
// - Path
const path = require("path");
// - Express session
const session = require("express-session");
// - Secret
const authConfig = require("./configuration/auth.json");
// - Data functions
const { mockData } = require("./services/mockData");
// - Routes
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const cart = require("./routes/cart");
const favorite = require("./routes/favorite");

// Configurations
// - Handlebars
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.engine("handlebars", engine());
// - Static files
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.static(path.join(__dirname, "..", "dist")));
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
app.get("/", async (req, res) => {
  const products = await mockData.get.products();

  const currencyFormat = {
    minimumFractionDigits: 2,
    style: "currency",
    currency: "BRL",
  };

  products.forEach((product, index) => {
    products[index]["formatted_price"] = Number(product.price).toLocaleString(
      "pt-BR",
      currencyFormat
    );
  });

  return res.render("index", { products, title: "Fit Shop" });
});

app.use("/conta", auth); // - Authentication
app.use("/admin", admin); // - Admin
app.use("/carrinho", cart); // - Shopping cart
app.use("/favoritos", favorite); // - Favorite list

app.listen(process.env.PORT ?? PORT, () => {
  return console.log(`Server is running on port ${PORT}!`);
});
