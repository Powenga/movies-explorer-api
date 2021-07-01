require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/movExplorerDB',
  ORIGIN = 'http://localhost:3001',
  JWT_TOKEN,
  NODE_ENV,
} = process.env;

const DEV_SECRET_KEY = 'some-secret-key';
const SALT_ROUNDS = 10;

module.exports = {
  PORT,
  MONGO_URL,
  ORIGIN,
  JWT_TOKEN,
  DEV_SECRET_KEY,
  SALT_ROUNDS,
  NODE_ENV,
};
