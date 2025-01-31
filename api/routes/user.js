const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user')

router.get('/', UserController.user_get_all_users);

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', UserController.user_delete_user);

module.exports = router;