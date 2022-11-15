// - Express
const express = require("express");
const router = express.Router();

// - Application paths
const { paths } = require("../utils/paths");

// - Update data
const { updateCarts } = require("../utils/data");

router.get("/adicionar", (req, res) => {
  res.render("cart/add", { title: "Carrinho" });
});

router.post("/adicionar", (req, res) => {
  const carts = require(paths.carts);
  const cart = {
    user_id: req.body.user_id,
    products: [{ id: req.body.id, quantity: req.body.quantity }],
  };
  const newCarts = [...carts];
  newCarts.push(cart);
  updateCarts(newCarts, "create");
  res.redirect("/carrinho");
});

router.get("/", (req, res) => {
  res.send("carrinho");
});

module.exports = router;
