// - Express
const express = require('express');
const router = express.Router();
// - BcryptJS
const bcrypt = require('bcryptjs');
// - JSONWebToken
const jwt = require('jsonwebtoken');
// - Data functions
const { mockData } = require('../../services/mockData');
// - Secret
const authConfig = require('../../configuration/auth.json');

function generateToken(id) {
  return jwt.sign({ id }, authConfig.secret, {
    expiresIn: 60 * 60 * 24, // 24 hours (1 day)
  });
}

// Create
router.get('/cadastrar', (req, res) => {
  return res.render('auth/registerForm', { title: 'Criar Conta' });
});

router.post('/cadastrar', async (req, res) => {
  const {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    // password_verification: passwordVerification,
  } = req.body;

  const users = await mockData.get.users();
  const newUsers = [...users];

  // Encrypt password
  const hash = await bcrypt.hash(password, 10);

  const newUser = {
    id:
      newUsers.length === 0
        ? '0'
        : String(Number(newUsers[newUsers.length - 1].id) + 1),
    email,
    password: hash,
    first_name: firstName,
    last_name: lastName,
    is_admin: String(false),
    favorite_ids: [],
  };
  newUsers.push(newUser);

  mockData.update.users(newUsers, 'create');

  req.session.user = newUser;
  req.session.authorization = `Bearer ${generateToken(newUser.id)}`;

  return res.redirect('/');
});

// Authenticate
router.get('/entrar', (req, res) => {
  return res.render('auth/authenticateForm', { title: 'Entrar' });
});

router.post('/entrar', async (req, res) => {
  const users = await mockData.get.users();
  const { email, password } = req.body;

  const userFound = users.find((user) => email === user.email);

  if (!userFound) {
    return res.redirect('/conta/entrar');
  }

  if (!(await bcrypt.compare(password, userFound.password))) {
    return res.redirect('/conta/entrar');
  }

  req.session.user = userFound;
  req.session.authorization = `Bearer ${generateToken(userFound.id)}`;

  return res.redirect('/');
});

// Logout
router.get('/sair', (req, res) => {
  req.session = null;
  res.redirect('/');
});

module.exports = router;
