const User = require('../models/user.model')

const getAllAccounts = async () => {
    const users = await User.find().select('-password')
    return users
}

const getAccountById = async (id) => {
    const user = await User.findById(id).select('-password')
    return user
}

const deleteAccount = async (id) => {
    await User.findByIdAndDelete(id)
}

const updateAccount = async (userId, updateData, currentUserId) => {
    const allowedFields = ['username', 'email'];
    const filteredData = {};

    for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
            filteredData[field] = updateData[field].trim();
        }
    }

    if (Object.keys(filteredData).length === 0) {
        throw new Error('No valid fields to update');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (userId.toString() !== currentUserId.toString()) {
        throw new Error('Unauthorized: You can only update your own account');
    }

    if (filteredData.username && filteredData.username !== user.username) {
        const existingUsername = await User.findOne({
            username: filteredData.username,
            _id: { $ne: userId }
        });

        if (existingUsername) {
            throw new Error('Username already exists');
        }
    }
    if (filteredData.email && filteredData.email !== user.email) {
        const existingEmail = await User.findOne({
            email: filteredData.email,
            _id: { $ne: userId }
        });

        if (existingEmail) {
            throw new Error('Email already exists');
        }
    }

    filteredData.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: filteredData },
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
        throw new Error('Failed to update user');
    }

    return updatedUser;
}

module.exports = {
    getAllAccounts,
    getAccountById,
    deleteAccount,
    updateAccount
}