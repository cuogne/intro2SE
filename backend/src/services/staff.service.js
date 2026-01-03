const Staff = require('../models/staff.model');

/**
 * Get all staff with optional filters and pagination
 * @param {Object} filters - { search, role, page, limit }
 * @returns {Object} - { staffs, total, page, totalPages }
 */
const getAllStaff = async (filters = {}) => {
    const { search, role, page = 1, limit = 10 } = filters;

    // Build query
    const query = {};

    // Search by name, email, or code
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { code: { $regex: search, $options: 'i' } }
        ];
    }

    // Filter by role
    if (role && role !== 'all') {
        query.role = role;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [staffs, total] = await Promise.all([
        Staff.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit)),
        Staff.countDocuments(query)
    ]);

    return {
        staffs,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit)
    };
};

/**
 * Get staff by ID
 * @param {String} id - Staff ID
 * @returns {Object} - Staff object
 */
const getStaffById = async (id) => {
    const staff = await Staff.findById(id);
    if (!staff) {
        throw new Error('Staff not found');
    }
    return staff;
};

/**
 * Create new staff
 * @param {Object} staffData - Staff data
 * @returns {Object} - Created staff object
 */
const createStaff = async (staffData) => {
    // Check if email already exists
    const existingEmail = await Staff.findOne({ email: staffData.email });
    if (existingEmail) {
        throw new Error('Email already exists');
    }

    // Check if code already exists
    const existingCode = await Staff.findOne({ code: staffData.code });
    if (existingCode) {
        throw new Error('Staff code already exists');
    }

    const staff = new Staff(staffData);
    await staff.save();
    return staff;
};

/**
 * Update staff by ID
 * @param {String} id - Staff ID
 * @param {Object} updateData - Data to update
 * @returns {Object} - Updated staff object
 */
const updateStaff = async (id, updateData) => {
    const staff = await Staff.findById(id);
    if (!staff) {
        throw new Error('Staff not found');
    }

    // Check if email is being changed and is unique
    if (updateData.email && updateData.email !== staff.email) {
        const existingEmail = await Staff.findOne({
            email: updateData.email,
            _id: { $ne: id }
        });
        if (existingEmail) {
            throw new Error('Email already exists');
        }
    }

    // Check if code is being changed and is unique
    if (updateData.code && updateData.code !== staff.code) {
        const existingCode = await Staff.findOne({
            code: updateData.code,
            _id: { $ne: id }
        });
        if (existingCode) {
            throw new Error('Staff code already exists');
        }
    }

    // Update fields
    Object.assign(staff, updateData);
    staff.updatedAt = Date.now();

    await staff.save();
    return staff;
};

/**
 * Delete staff by ID
 * @param {String} id - Staff ID
 */
const deleteStaff = async (id) => {
    const staff = await Staff.findByIdAndDelete(id);
    if (!staff) {
        throw new Error('Staff not found');
    }
    return staff;
};

/**
 * Toggle staff status (active <-> locked)
 * @param {String} id - Staff ID
 * @returns {Object} - Updated staff object
 */
const toggleStaffStatus = async (id) => {
    const staff = await Staff.findById(id);
    if (!staff) {
        throw new Error('Staff not found');
    }

    staff.status = staff.status === 'active' ? 'locked' : 'active';
    staff.updatedAt = Date.now();

    await staff.save();
    return staff;
};

/**
 * Update last login time
 * @param {String} id - Staff ID
 * @returns {Object} - Updated staff object
 */
const updateLastLogin = async (id) => {
    const staff = await Staff.findByIdAndUpdate(
        id,
        {
            lastLogin: Date.now(),
            updatedAt: Date.now()
        },
        { new: true }
    );

    if (!staff) {
        throw new Error('Staff not found');
    }

    return staff;
};

module.exports = {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    toggleStaffStatus,
    updateLastLogin
};
