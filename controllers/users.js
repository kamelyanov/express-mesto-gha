const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

   User.create({ name, about, avatar })
     .then(user => res.send({ data: user }))
     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.getUsers = (req, res) => {
  User.find({})
     .then(user => res.send({ data: users }))
     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.updateUser = (req,res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.updateAvatar = (req,res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}


