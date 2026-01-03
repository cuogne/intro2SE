const staffService = require('../services/staff.service');

/**
 * Get all staff with filters and pagination
 * GET /api/v1/staff?search=&role=&page=1&limit=10
 */
const getAllStaff = async (req, res) => {
    try {
        const { search, role, page, limit } = req.query;

        const result = await staffService.getAllStaff({
            search,
            role,
            page: page || 1,
            limit: limit || 10
        });

        res.status(200).json({
            success: true,
            data: result.staffs,
            pagination: {
                total: result.total,
                page: result.page,
                totalPages: result.totalPages
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error getting staff list',
            error: error.message
        });
    }
};

/**
 * Get staff by ID
 * GET /api/v1/staff/:id
 */
const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await staffService.getStaffById(id);

        res.status(200).json({
            success: true,
            data: staff
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Error getting staff',
            error: error.message
        });
    }
};

/**
 * Create new staff (Admin only)
 * POST /api/v1/staff
 */
const createStaff = async (req, res) => {
    try {
        const { name, email, code, role, status, avatar, initials } = req.body;

        // Validation
        if (!name || !email || !code || !role) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, email, code, role'
            });
        }

        const staff = await staffService.createStaff({
            name,
            email,
            code,
            role,
            status: status || 'active',
            avatar,
            initials
        });

        res.status(201).json({
            success: true,
            message: 'Staff created successfully',
            data: staff
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating staff',
            error: error.message
        });
    }
};

/**
 * Update staff (Admin only)
 * PUT /api/v1/staff/:id
 */
const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, code, role, status, avatar, initials } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (code !== undefined) updateData.code = code;
        if (role !== undefined) updateData.role = role;
        if (status !== undefined) updateData.status = status;
        if (avatar !== undefined) updateData.avatar = avatar;
        if (initials !== undefined) updateData.initials = initials;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        const staff = await staffService.updateStaff(id, updateData);

        res.status(200).json({
            success: true,
            message: 'Staff updated successfully',
            data: staff
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating staff',
            error: error.message
        });
    }
};

/**
 * Delete staff (Admin only)
 * DELETE /api/v1/staff/:id
 */
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        await staffService.deleteStaff(id);

        res.status(200).json({
            success: true,
            message: 'Staff deleted successfully'
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Error deleting staff',
            error: error.message
        });
    }
};

/**
 * Toggle staff status (active <-> locked) (Admin only)
 * PATCH /api/v1/staff/:id/status
 */
const toggleStaffStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await staffService.toggleStaffStatus(id);

        res.status(200).json({
            success: true,
            message: `Staff status changed to ${staff.status}`,
            data: staff
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Error toggling staff status',
            error: error.message
        });
    }
};

/**
 * Update last login (Admin only)
 * PATCH /api/v1/staff/:id/login
 */
const updateLastLogin = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await staffService.updateLastLogin(id);

        res.status(200).json({
            success: true,
            message: 'Last login updated',
            data: staff
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Error updating last login',
            error: error.message
        });
    }
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
