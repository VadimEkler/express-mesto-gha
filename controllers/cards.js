const httpConstants = require('http2').constants;
const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    // чтобы получить поле owner в виде объекта, использую метод populate
    .populate(['owner'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      // вместо простого возврата в случае успешного запроса, использую метод populate,
      // чтобы вернуть в поле owner объект пользователя
      Card.findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => res.status(httpConstants.HTTP_STATUS_CREATED).send(data))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена!' });
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then(() => {
      res.status(httpConstants.HTTP_STATUS_OK).send({ message: 'Карточка удалена!' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена!' });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id карточки!' });
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner'])
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status((httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id карточки!' }));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status((httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена!' }));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .populate(['owner'])
    .then((card) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status((httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный id карточки!' }));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status((httpConstants.HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена!' }));
      } else {
        next(err);
      }
    });
};
