const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Admins only'
        })
    }
    next()
}

const authorizeUser = (req, res, next) => {
    if (!req.user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        })
    }
    next()
}

module.exports = {
    authorizeAdmin,
    authorizeUser
}