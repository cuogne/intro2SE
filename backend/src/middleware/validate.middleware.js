const validateRegister = (req, res, next) => {
    const {username, email, password, name} = req.body

    // fill all
    if (!username || !email || !password || !name) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required: username, email, password, name'
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

module.exports = {
    validateRegister,
    validateLogin
}