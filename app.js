const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { PORT, MONGO_URL, ORIGIN } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const { errorHandler } = require('./middlewares/error-handler');
const { limiter } = require('./middlewares/limiter');

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
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

app.set('trust proxy', 1);
app.use(limiter);

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
