const bcrypt = reqire('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  ok,
  created,
  badRequest,
  notFound,
  defaultError,
} = require('../constants/statuses');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(defaultError).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
  User.create({ name, about, avatar })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash
    }))
    .then((user) => res.status(created).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(badRequest).send({ message: 'Пользователь с таким Email уже существует' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(notFound).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(ok).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(defaultError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      res.status(badRequest).send({ message: 'Переданы некорректные данные' });
    });
};

module.exports.getUserMe = (req, res) => {
  User.findById(req.user._id)
    .then((user) => res.status(ok).send(user))
    .catch(() => {
      res.status(badRequest).send({ message: 'Переданы некорректные данные' });
    });
};
