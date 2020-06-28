const express = require('express');
const UsersController = require('../controllers/users_controller.js');
const router = express.Router();

router.post('/register', UsersController.register);
router.post('/login', UsersController.login);
router.get('/activation/:token', UsersController.activateAccount);
router.post('/forgot-password', UsersController.forgotPassword);
router.get('/reset-password/:token', UsersController.resetPasswordToken);
router.post('/reset-password/:token', UsersController.resetPassword);

module.exports = router;
