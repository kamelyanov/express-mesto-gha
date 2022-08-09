const Card = require('../models/cards');
const {
  ok,
  created,
  badRequest,
  notFound,
  defaultError,
} = require('../constants/statuses');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => res.status(defaultError).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(created).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(defaultError).send({ message: 'Произошла ошибка при создании карточки' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Карточка не найдена' });
        return;
      }
    })
    .then((card) => {
      if (`${card.owner}` !== req.user._id) {
        res.status(badRequest).send({ message: 'Нельзя удалять карточки других пользователей' });
        return;
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => {
      res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка при удалении карточки' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(notFound).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(ok).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};
