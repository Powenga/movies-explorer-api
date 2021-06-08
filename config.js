require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb ',
  ORIGIN = 'http://localhost:3001',
  SECRET_KEY = 'some-secret-key',
} = process.env;

module.exports = {
  PORT,
  MONGO_URL,
  ORIGIN,
  SECRET_KEY,
};
