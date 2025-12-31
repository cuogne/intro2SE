const authService = require('../services/auth.service')

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const newUser = await authService.register({ username, email, password })
        res.status(201).json({
            success: true,
            data: newUser
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error registering user',
            error: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const { user, token } = await authService.login({ username, password })
        res.status(200).json({
            success: true,
            data: { user, token }
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'error logging in',
            error: error.message
        })
    }
}

module.exports = {
    register,
    login
}