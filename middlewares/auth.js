const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_MESSAGE } = require('../constants');
const {
  JWT_TOKEN,
  DEV_SECRET_KEY,
  NODE_ENV,
} = require('../config');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send({ message: UNAUTHORIZED_MESSAGE });
  }

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_TOKEN : DEV_SECRET_KEY,
    );
  } catch (err) {
    return res.status(401).send({ message: UNAUTHORIZED_MESSAGE });
  }

  req.user = payload;

  return next();
};
