const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Пераданный email не валиден.',
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
