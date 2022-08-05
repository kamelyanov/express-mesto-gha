const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const {
  notFound,
} = require('../constants/statuses');


router.get('/', (req, res) => {
  res.send('Hello World');
});

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(notFound).send({ message: 'Страница не найдена' });
});

module.exports = router;
