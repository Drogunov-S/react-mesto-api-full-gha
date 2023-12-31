const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const cors = require('cors');
// const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const errorsHandler = require('./middlewares/errorsHandler');
const router = require('./routes');

const app = express();
const {
  PORT,
  DB_SCHEMA,
  DB_PORT,
  DB_URL,
  REQUEST_RATE_LIMIT_WINDOWS_MS,
  REQUEST_RATE_LIMIT_COUNT,
} = require('./utils/config');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit.rateLimit({
  windowMs: REQUEST_RATE_LIMIT_WINDOWS_MS,
  max: REQUEST_RATE_LIMIT_COUNT,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(express.json());
app.use(helmet());
// app.use(cookieParser());
app.use(limiter);

mongoose.connect(`${DB_URL}:${DB_PORT}/${DB_SCHEMA}`).then(() => console.log('DB connection'));

app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`DB connect: ${mongoose.connection.readyState}`);
});
