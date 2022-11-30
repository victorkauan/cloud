// - JSONWebToken
const jwt = require('jsonwebtoken');
// - Secret
const authConfig = require('../configuration/auth.json');

module.exports = (req, res, next) => {
  const authHeader = req.session.authorization;

  if (!authHeader) {
    return res.redirect('/conta/entrar');
  }

  const authParts = authHeader.split(' ');

  if (authParts.length !== 2) {
    return res.redirect('/conta/entrar');
  }

  const [prefix, token] = authParts;

  if (!/^Bearer$/i.test(prefix)) {
    return res.redirect('/conta/entrar');
  }

  jwt.verify(token, authConfig.secret, (error, decoded) => {
    if (error) {
      return res.redirect('/conta/entrar');
    }

    req.userId = decoded.id;
    return next();
  });
};
