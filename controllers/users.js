const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const {
  USER_NOT_FOUND_MESSAGE,
  USER_INVALID_ID_MESSAGE,
  USER_EMAIL_OR_NAME_IS_MISSING_MESSAGE,
  USER_INVALID_DATA_MESSAGE,
  MONGOOSE_TYPE_ERROR,
  MONGOOSE_VALIDARION_ERROR,
} = require('../constants');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError(USER_NOT_FOUND_MESSAGE))
    .then((user) => {
      res.send(user);
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
    next(new BadRequestError(USER_EMAIL_OR_NAME_IS_MISSING_MESSAGE));
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
        if (err.name === MONGOOSE_TYPE_ERROR || err.name === MONGOOSE_VALIDARION_ERROR) {
          next(new BadRequestError(USER_INVALID_DATA_MESSAGE));
        } else {
          next(err);
        }
      });
  }
};
