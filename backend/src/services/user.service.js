const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

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

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new Error('User not found');

    const isMatch = bcrypt.compareSync(currentPassword, user.password)
    if (!isMatch) throw new Error('Current password is incorrect');

    const salt = bcrypt.genSaltSync(10)
    user.password = bcrypt.hashSync(newPassword, salt)

    user.updatedAt = new Date();
    await user.save();
};

const updateUserByAdmin = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Admin có thể cập nhật role
    if (updateData.role !== undefined) {
        const validRoles = ['user', 'admin'];
        if (!validRoles.includes(updateData.role)) {
            throw new Error('Invalid role');
        }
        user.role = updateData.role;
    }

    // Admin có thể cập nhật email
    if (updateData.email !== undefined) {
        const trimmedEmail = updateData.email.trim();
        if (trimmedEmail && trimmedEmail !== user.email) {
            const existingEmail = await User.findOne({
                email: trimmedEmail,
                _id: { $ne: userId }
            });

            if (existingEmail) {
                throw new Error('Email already exists');
            }
            user.email = trimmedEmail;
        }
    }

    user.updatedAt = new Date();
    await user.save();

    return user.toObject({
        getters: true, versionKey: false, transform: (doc, ret) => {
            delete ret.password;
            return ret;
        }
    });
};

module.exports = {
    getAllAccounts,
    getAccountById,
    deleteAccount,
    updateAccount,
    changePassword,
    updateUserByAdmin
}