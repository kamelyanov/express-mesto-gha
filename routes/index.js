const router = require('express').Router();
const auth = require('../middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const cardRouter = require('./cards');
const { login, createUser } = require('../controllers/users');

const {
  notFound,
} = require('../constants/statuses');

router.get('/', (req, res) => {
  res.send('Hello World');
});

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri({ scheme: ['http', 'https'] }),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(notFound).send({ message: 'Страница не найдена' });
});

module.exports = router;
