// - Express
const express = require('express');
const router = express.Router();
// - BcryptJS
const bcrypt = require('bcryptjs');
// - Data functions
const { getUsers, updateUsers } = require('../../utils/data');

// Create
router.get('/cadastrar', (req, res) => {
  res.render('auth/registerForm', { title: 'Criar Conta' });
});

router.post('/cadastrar', async (req, res) => {
  const {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    // password_verification: passwordVerification,
  } = req.body;

  const users = await getUsers();
  const newUsers = [...users];

  // Encrypt password
  const hash = await bcrypt.hash(password, 10);

  newUsers.push({
    id: String(Number(newUsers[newUsers.length - 1].id) + 1),
    email,
    password: hash,
    first_name: firstName,
    last_name: lastName,
    is_admin: String(false),
  });

  updateUsers(newUsers, 'create');

  res.redirect('/');
});

module.exports = router;
