const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { PORT, MONGO_URL, ORIGIN } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const { errorHandler } = require('./middlewares/error-handler');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(
  cors({
    credentials: true,
    origin: ORIGIN,
  }),
);

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

// celebrate errors

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
