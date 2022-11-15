// - Express
const express = require("express");
const app = express();
const PORT = 3001;
// - Handlebars
const { engine } = require("express-handlebars");
// - Path
const path = require("path");

// Configurations
// - Handlebars
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.engine("handlebars", engine());
// - Forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const admin = require("./routes/admin");
const cart = require("./routes/cart");
// - General
app.get("/", (req, res) => {
  const message = "Hello, world!";
  res.render("index", { title: "Application", message });
});

// - Admin
app.use("/admin", admin);
app.use("/carrinho", cart);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
