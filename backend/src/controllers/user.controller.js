const userService = require('../services/user.service')

const register = async (req, res) => {
    try {
        const {username, email, password, name, role} = req.body
        const newUser = await userService.register({ username, email, password, name, role })
        res.status(201).json({
            success: true,
            data: {
                username: newUser.username,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
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
        const {username, password} = req.body
        const { checkUser, token } = await userService.login({ username, password})
        res.status(200).json({
            success: true,
            data: {
                user: {
                    username: checkUser.username,
                    email: checkUser.email,
                    name: checkUser.name,
                    role: checkUser.role
                },
                token
            }
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