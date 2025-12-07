const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'ko co user'
        })
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'khong co quyen admin'
        })
    }
    next()
}

const authorizeUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'ko co user'
        })
    }
    next()
}

module.exports = {
    authorizeAdmin,
    authorizeUser
}