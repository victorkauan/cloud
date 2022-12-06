// - Express
const express = require("express");
const router = express.Router();
// - Data functions
const { mockData } = require("../services/mockData");

router.get("/adicionar", (req, res) => {
  return res.render("cart/add", { title: "Carrinho" });
});

router.post("/adicionar", async (req, res) => {
  const carts = await mockData.get.carts();
  const newCarts = [...carts];

  const cart = {
    user_id: req.session.user.id,
    products: [{ id: req.body.id, quantity: req.body.quantity }],
  };
  newCarts.push(cart);

  mockData.update.carts(newCarts, "create");

  return res.redirect("/carrinho");
});

router.get("/", async (req, res) => {
  const carts = await mockData.get.carts();
  const products = await mockData.get.products();

  carts.forEach((cart) => {
    cart.products.forEach((product) => {
      const teste = products.find(function (teste2) {
        return product.id == teste2.id;
      });
    });
  });

  return res.render("cart/listCart", { carts });
});

module.exports = router;
