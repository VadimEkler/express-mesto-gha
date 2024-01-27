const express = require('express');
const mongoose = require('mongoose');
const httpConstants = require('http2').constants;

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {});

app.use((req, res, next) => {
  req.user = {
    _id: '6596524093ec8d6a7d3d711d',
  };

  next();
});

app.use('/', require('./routes/index'));

app.use('*', (req, res) => {
  res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

// Мидлвар для ошибки сервера

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
