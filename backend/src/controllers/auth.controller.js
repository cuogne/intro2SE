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
            message: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body
        const result = await authService.login({ username, password })
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body
        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            })
        }
        const result = await authService.refreshAccessToken(refreshToken)
        res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body
        if (refreshToken) {
            await authService.logout(refreshToken)
        }
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    register,
    login,
    refresh,
    logout
}