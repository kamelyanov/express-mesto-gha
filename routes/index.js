const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');

router.get('/', (req, res) => {
  res.status(200);
  res.send('Hello World');
});

router.use(userRouter);
router.use(cardRouter);

module.exports = router;
