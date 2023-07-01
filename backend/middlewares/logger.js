const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports:
    [
      new winston.transports.File({
        filename: 'request.log',
        level: 'info',
      }),
    ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    }),
  ],
  format: winston.format.json(),
});

module.exports = { requestLogger, errorLogger };
