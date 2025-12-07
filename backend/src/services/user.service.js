const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// dki tai khoan
const register = async ({ username, email, password, name, role }) => {
    const checkUsername = await User.findOne({ username })
    const checkEmail = await User.findOne({ email })

    if (checkUsername) {
        throw new Error('Username already exists')
    }

    if (checkEmail) {
        throw new Error('Email already exists')
    }

    // hashing password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    // create new account
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        name,
        role: role || 'user'
    })

    await newUser.save() // save in db
    return newUser
}

const login = async ({ username, password}) => {
    const checkUser = await User.findOne({username})

    if (!checkUser){
        throw new Error('username ko ton tai')
    }

    const checkPassword = bcrypt.compareSync(password, checkUser.password)
    if (!checkPassword){
        throw new Error('Sai pass roi')
    }

    // create jwt token
    const token = jwt.sign({
        id: checkUser._id,
        username: checkUser.username,
        role: checkUser.role
    },
    process.env.JWT_SECRET, 
    { expiresIn: '1h' })

    return { checkUser, token }
}

module.exports = {
    register,
    login
}