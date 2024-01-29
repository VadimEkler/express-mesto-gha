const { errors } = require('celebrate');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();

const { PORT } = process.env;

const app = express();

app.use(express.json());

mongoose.connect(process.env.DB_URL, {});

app.use('/', require('./routes/index'));

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
