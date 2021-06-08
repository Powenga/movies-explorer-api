const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { PORT, MONGO_URL, ORIGIN } = require('./config');

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


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
