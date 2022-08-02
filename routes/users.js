const router = require('express').Router();

const { createUser, getUsers, getUser, updateUser, updateAvatar } = require('../controllers/users');

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.patch('/:id', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;
