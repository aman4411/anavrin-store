const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');

const router = express.Router();

router.route('/user/register').post(registerUser);
router.route('/user/login').post(loginUser);
router.route('/user/logout').get(logoutUser);
module.exports = router;