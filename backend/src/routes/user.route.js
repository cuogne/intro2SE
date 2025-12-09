const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const { validateRegister, validateLogin } = require('../middleware/validate.middleware')

router.post('/register', validateRegister, userController.register)
router.post('/login', validateLogin, userController.login)

module.exports = router