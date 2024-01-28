const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const httpConstants = require('http2').constants;

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

app.use('/', require('./routes/index'));

app.use(errors());

// Мидлвар для централизованной обработки ошибок

app.use((err, req, res, next) => {
  const { statusCode = httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
