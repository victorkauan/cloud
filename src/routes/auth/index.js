// - Express
const express = require('express');
const router = express.Router();
// - BcryptJS
const bcrypt = require('bcryptjs');
// - JSONWebToken
const jwt = require('jsonwebtoken');
// - Data functions
const { getUsers, updateUsers } = require('../../utils/data');
// - Secret
const authConfig = require('../../config/auth.json');

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

  return res.redirect('/');
});

// Authenticate
router.get('/entrar', (req, res) => {
  return res.render('auth/authenticateForm', { title: 'Entrar' });
});

router.post('/entrar', async (req, res) => {
  const users = await getUsers();
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

module.exports = router;