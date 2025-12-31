const userService = require('../services/user.service')

const getMyAccount = async (req, res) => {
    try {
        const userId = req.user.id
        const account = await userService.getAccountById(userId)
        res.status(200).json({
            success: true,
            data: account
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'error getting my account',
            error: error.message
        })
    }
}

const getAllAccounts = async (req, res) => {
    try {
        const accounts = await userService.getAllAccounts()
        res.status(200).json({
            success: true,
            data: accounts
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'error getting all accounts',
            error: error.message
        })
    }
}

const getAccountById = async (req, res) => {
    try {
        const { id } = req.params
        const account = await userService.getAccountById(id)
        res.status(200).json({
            success: true,
            data: account
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'error getting account by id',
            error: error.message
        })
    }
}

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id // Lấy từ token,
        await userService.deleteAccount(userId)
        res.status(200).json({
            success: true,
            message: 'account deleted successfully'
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'error deleting account',
            error: error.message
        })
    }
}

const updateAccount = async (req, res) => {
    try {
        const userId = req.user.id // Lấy từ token
        const { username, email } = req.body

        const updatedUser = await userService.updateAccount(
            userId,
            { username, email },
            userId
        )

        res.status(200).json({
            success: true,
            message: 'Account updated successfully',
            data: updatedUser
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating account',
            error: error.message
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id // Lấy từ token
        const { currentPassword, newPassword } = req.body

        await userService.changePassword(userId, currentPassword, newPassword)

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        })
    }
}

module.exports = {
    getMyAccount,
    getAllAccounts,
    getAccountById,
    deleteAccount,
    updateAccount,
    changePassword
}