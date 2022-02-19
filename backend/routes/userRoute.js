const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } = require('../controllers/userController');

const router = express.Router();

router.route('/user/register').post(registerUser);
router.route('/user/login').post(loginUser);
router.route('/user/logout').get(logoutUser);
router.route('/user/password/forgot').post(forgotPassword);
router.route('/user/password/reset/:token').put(resetPassword);
module.exports = router;