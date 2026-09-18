const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const generateRefreshToken = async (userId) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await RefreshToken.create({ userId, token, expiresAt });

  return token;
};

const register = async ({ username, email, password }) => {
  const checkUsername = await User.findOne({ username });
  const checkEmail = await User.findOne({ email });

  if (checkUsername) {
    throw new Error('Username already exists');
  }

  if (checkEmail) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await newUser.save();

  return {
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
  };
};

const login = async ({ username, password }) => {
  const checkUser = await User.findOne({ username });

  if (!checkUser) {
    throw new Error('Username or password is incorrect');
  }

  const checkPassword = await bcrypt.compare(password, checkUser.password);
  if (!checkPassword) {
    throw new Error('Username or password is incorrect');
  }

  const accessToken = generateAccessToken(checkUser);
  const refreshToken = await generateRefreshToken(checkUser._id);

  return {
    user: {
      id: checkUser._id,
      username: checkUser.username,
      email: checkUser.email,
      role: checkUser.role,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshTokenStr) => {
  const storedToken = await RefreshToken.findOne({ token: refreshTokenStr });

  if (!storedToken) {
    throw new Error('Invalid refresh token');
  }

  if (storedToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ _id: storedToken._id });
    throw new Error('Refresh token expired');
  }

  const user = await User.findById(storedToken.userId);
  if (!user) {
    await RefreshToken.deleteOne({ _id: storedToken._id });
    throw new Error('User not found');
  }

  const newAccessToken = generateAccessToken(user);

  return {
    accessToken: newAccessToken,
  };
};

const logout = async (refreshTokenStr) => {
  await RefreshToken.deleteOne({ token: refreshTokenStr });
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
};
