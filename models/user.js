const validator = require('validator');
const mongoose = require('mongoose');
const { USER_INVALID_EMAIL_MESSAGE } = require('../constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: USER_INVALID_EMAIL_MESSAGE,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxLengeh: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
