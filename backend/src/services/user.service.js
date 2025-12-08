const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// dki tai khoan
const register = async ({ username, email, password}) => {
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
        role: 'user'
    })

    await newUser.save() // save in db

    return {
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        }
    }
}

const login = async ({ username, password}) => {
    const checkUser = await User.findOne({username})

    if (!checkUser){
        throw new Error('Username not found')
    }

    const checkPassword = bcrypt.compareSync(password, checkUser.password)
    if (!checkPassword){
        throw new Error('Incorrect password')
    }

    // create jwt token
    const token = jwt.sign({
        id: checkUser._id,
        username: checkUser.username,
        role: checkUser.role
    },
    process.env.JWT_SECRET, 
    { expiresIn: '1h' })

    return { 
        user: {
            id: checkUser._id,
            username: checkUser.username,
            email: checkUser.email,
            role: checkUser.role
        },
        token 
    }
}

module.exports = {
    register,
    login
}