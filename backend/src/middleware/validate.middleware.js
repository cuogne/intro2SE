const validateRegister = (req, res, next) => {
    const { username, email, password } = req.body

    // fill all
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required: username, email, password'
        })
    }

    // validate username (3 - 15)
    const usernameTrim = username.trim()
    if (usernameTrim.length < 3 || usernameTrim.length > 15) {
        return res.status(400).json({
            success: false,
            message: 'Username must be between 3 and 15 characters'
        })
    }

    // 0-9, a-z, A-Z, _
    if (!/^[a-zA-Z0-9_]+$/.test(usernameTrim)) {
        return res.status(400).json({
            success: false,
            message: 'Username can only contain letters, numbers, and underscores'
        })
    }

    // validate email
    const emailTrim = email.trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // abc@xyz.pst
    if (!emailRegex.test(emailTrim)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        })
    }

    // validate password
    const passwordTrim = password.trim()
    if (passwordTrim.length < 6 || passwordTrim.length > 20) {
        return res.status(400).json({
            success: false,
            message: 'Password must be between 6 and 20 characters'
        })
    }

    next()
}

const validateLogin = (req, res, next) => {
    const {username, password} = req.body

    if (!username || !password){
        return res.status(400).json({
            success: false,
            message: 'Username and password are required'
        })
    }
    next()
}

const validateUpdateAccount = (req, res, next) => {
    const { username, email, ...otherFields } = req.body

    // Check nếu có field không được phép (role, password, etc.)
    if (Object.keys(otherFields).length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Only username and email can be updated',
            invalidFields: Object.keys(otherFields)
        })
    }

    // Phải có ít nhất 1 field để update
    if (!username && !email) {
        return res.status(400).json({
            success: false,
            message: 'At least one field (username or email) is required'
        })
    }

    // Validate username nếu có
    if (username !== undefined) {
        const usernameTrim = username.trim()

        if (usernameTrim.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Username cannot be empty'
            })
        }

        if (usernameTrim.length < 3 || usernameTrim.length > 15) {
            return res.status(400).json({
                success: false,
                message: 'Username must be between 3 and 15 characters'
            })
        }

        // 0-9, a-z, A-Z, _
        if (!/^[a-zA-Z0-9_]+$/.test(usernameTrim)) {
            return res.status(400).json({
                success: false,
                message: 'Username can only contain letters, numbers, and underscores'
            })
        }
    }

    // Validate email nếu có
    if (email !== undefined) {
        const emailTrim = email.trim()

        if (emailTrim.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Email cannot be empty'
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(emailTrim)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            })
        }
    }

    next()
}

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateAccount
}