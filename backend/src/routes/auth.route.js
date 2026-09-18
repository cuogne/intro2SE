const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const { validateRegister, validateLogin } = require('../middleware/validate.middleware');
const { loginLimiter } = require('../middleware/rateLimiter.middleware');

// api/v1/auth
router.post('/register', validateRegister, authController.register);
router.post('/login', loginLimiter, validateLogin, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', auth, authController.logout);

module.exports = router;
