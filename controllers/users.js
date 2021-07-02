const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const Unauthorized = require('../errors/unauthorized-err');
const {
  USER_NOT_FOUND_MESSAGE,
  USER_INVALID_ID_MESSAGE,
  USER_DATA_IS_MISSING_MESSAGE,
  USER_INVALID_DATA_MESSAGE,
  USER_ALREADY_EXIST_MESSAGE,
  USER_UNAUTHORIZED_MESSAGE,
  USER_LOGOUT_MESSAGE,
  MONGOOSE_TYPE_ERROR,
  MONGOOSE_VALIDATION_ERROR,
  MONGO_DUPLICATE_ERROR_CODE,
} = require('../constants');

const {
  JWT_TOKEN,
  DEV_SECRET_KEY,
  SALT_ROUNDS,
  NODE_ENV,
} = require('../config');

function signToken(user) {
  return jwt.sign(
    { _id: user._id },
    NODE_ENV === 'production' ? JWT_TOKEN : DEV_SECRET_KEY,
    {
      expiresIn: '7d',
    },
  );
}

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  if (!email || !name || !password) {
    next(new BadRequestError(USER_DATA_IS_MISSING_MESSAGE));
  } else {
    bcrypt
      .hash(password, SALT_ROUNDS)
      .then((hash) => User.create({ email, password: hash, name }))
      .then((user) => {
        const token = signToken(user);
        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
          .status(201).send({ email, name, userId: user._id });
      })
      .catch((err) => {
        if (err.name === MONGOOSE_TYPE_ERROR || err.name === MONGOOSE_VALIDATION_ERROR) {
          next(new BadRequestError(USER_INVALID_DATA_MESSAGE));
        } else if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
          next(new ConflictError(USER_ALREADY_EXIST_MESSAGE));
        } else {
          next(err);
        }
      });
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError(USER_DATA_IS_MISSING_MESSAGE));
  } else {
    User.findOne({ email })
      .select('+password')
      .orFail(new Unauthorized(USER_UNAUTHORIZED_MESSAGE))
      .then((user) => bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized(USER_UNAUTHORIZED_MESSAGE);
          }
          return user;
        }))
      .then((user) => {
        const token = signToken(user);
        res
          .cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          })
          .send({ name: user.name, email: user.email, userId: user._id });
      })
      .catch(next);
  }
};

module.exports.logout = (req, res, next) => {
  try {
    res.cookie('jwt', '',
      {
        maxAge: 0,
        httpOnly: true,
        sameSite: true,
      })
      .send({ message: USER_LOGOUT_MESSAGE });
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(USER_NOT_FOUND_MESSAGE))
    .then((user) => {
      res.send({ name: user.name, email: user.email, userId: user._id });
    })
    .catch((err) => {
      if (err.name === MONGOOSE_TYPE_ERROR) {
        next(new BadRequestError(USER_INVALID_ID_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  if (!email || !name) {
    next(new BadRequestError(USER_DATA_IS_MISSING_MESSAGE));
  } else {
    User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      {
        new: true,
        runValidators: true,
      },
    )
      .orFail(new NotFoundError(USER_NOT_FOUND_MESSAGE))
      .then((user) => {
        res.send(user);
      })
      .catch((err) => {
        if (err.name === MONGOOSE_TYPE_ERROR || err.name === MONGOOSE_VALIDATION_ERROR) {
          next(new BadRequestError(USER_INVALID_DATA_MESSAGE));
        } else {
          next(err);
        }
      });
  }
};
