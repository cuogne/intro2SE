const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { validateRegister, validateLogin } = require('../middleware/validate.middleware')

// api/auth
router.post('/register', validateRegister, authController.register) // dang ky tai khoan
router.post('/login', validateLogin, authController.login) // dang nhap tai khoan

module.exports = router