const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization // lay token tu header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }

        const token = authHeader.split(' ')[1] // split token
        const decoded = jwt.verify(token, process.env.JWT_SECRET) // verify token
        const user = await User.findById(decoded.id) // tim user trong db

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        req.user = {
            id: user._id,
            username: user.username,
            role: user.role
        }
        next()

    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
        });
    }
}

module.exports = auth;