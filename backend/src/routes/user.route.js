const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const auth = require('../middleware/auth.middleware')
const { validateUpdateAccount } = require('../middleware/validate.middleware')
const { authorizeAdmin } = require('../middleware/authorization.middleware')

// api/v1/users

// user
router.get('/me', auth, userController.getMyAccount)                                // xem tt tai khoan cua chinh minh
router.put('/me/update', auth, validateUpdateAccount, userController.updateAccount) // cap nhat tt tai khoan
router.delete('/me', auth, userController.deleteAccount)                            // xoa tai khoan

// admin
router.get('/all', auth, authorizeAdmin, userController.getAllAccounts)             // xem tat ca tai khoan chi co admin
router.get('/all/:id', auth, authorizeAdmin, userController.getAccountById)         // xem 1 tai khoan theo id (admin)

module.exports = router