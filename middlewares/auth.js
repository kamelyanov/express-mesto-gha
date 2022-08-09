const jwt = require('jsonwebtoken');
const {
  badRequest,
} = require('../constants/statuses');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(badRequest).send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(badRequest).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};