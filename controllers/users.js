const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id пользователя!' });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с указанным id не найден!' });
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь c указанным id не найден!' });
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
    .orFail()
    .then((user) => res.status(httpConstants.HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь c указанным id не найден!' });
      } else {
        next(err);
      }
    });
};
