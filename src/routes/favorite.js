const express = require("express");
const { mockData } = require("../services/mockData");
const router = express.Router();

router.post("/add", async (req, res) => {
  const users = await mockData.get.users();
  const newUsers = [...users];

  const { product_id } = req.body;
  const { id } = req.session.user;
  const newUser = newUsers.find(function (user) {
    return id === user.id;
  });
  newUser.favoritos.push(product_id);

  mockData.update.users(newUsers, "update");

  res.redirect("/favoritos");
});

router.get("/", (req, res) => {
  const { favoritos } = req.session.user;
  return res.render("favorites/listaFavoritos", { favoritos });
});

module.exports = router;
