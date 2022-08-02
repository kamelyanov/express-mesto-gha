const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: users }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then(user => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err) {
        res.status(400).send({ message: 'Переданы некорректные данные' })
        return
      }
      res.status(500).send({ message: 'Произошла ошибка' })
    })
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((err) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' })
        return
      }
      res.status(200).send({ data: user })
    })
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((err) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' })
        return
      }
      res.status(200).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' })
    });
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((err) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' })
        return
      }
      res.status(200).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(500).send({ message: 'Произошла ошибка' })
    });
}