const express = require('express');
const userController = require('../users/userController');

const router = express.Router();

router.route('/user/login').post(userController.loginUserController);
router.route('/user/signup').post(userController.signupUserController);


module.exports = router;