const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    // чтобы получить поле owner в виде объекта, использую метод populate
    .populate(['owner'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      // вместо простого возврата в случае успешного запроса, использую метод populate,
      // чтобы вернуть в поле owner объект пользователя
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch((err) => res.status(404).send({ message: err.mesage }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      res.send({ message: 'Выбранная карточка удалена!' });
    })
    .catch(() => res.status(400).send({ message: 'Некорректный id' }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(400).send({ message: 'Некорректный id' }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(400).send({ message: 'Некорректный id' }));
};
