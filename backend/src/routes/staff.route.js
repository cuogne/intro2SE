const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const auth = require('../middleware/auth.middleware');
const { authorizeAdmin } = require('../middleware/authorization.middleware');

// All routes require authentication and admin authorization
router.use(auth, authorizeAdmin);

/**
 * @route   GET /api/v1/staff
 * @desc    Get all staff with filters and pagination
 * @access  Admin
 * @query   search, role, page, limit
 */
router.get('/', staffController.getAllStaff);

/**
 * @route   GET /api/v1/staff/:id
 * @desc    Get staff by ID
 * @access  Admin
 */
router.get('/:id', staffController.getStaffById);

/**
 * @route   POST /api/v1/staff
 * @desc    Create new staff
 * @access  Admin
 * @body    { name, email, code, role, status?, avatar?, initials? }
 */
router.post('/', staffController.createStaff);

/**
 * @route   PUT /api/v1/staff/:id
 * @desc    Update staff
 * @access  Admin
 * @body    { name?, email?, code?, role?, status?, avatar?, initials? }
 */
router.put('/:id', staffController.updateStaff);

/**
 * @route   DELETE /api/v1/staff/:id
 * @desc    Delete staff
 * @access  Admin
 */
router.delete('/:id', staffController.deleteStaff);

/**
 * @route   PATCH /api/v1/staff/:id/status
 * @desc    Toggle staff status (active <-> locked)
 * @access  Admin
 */
router.patch('/:id/status', staffController.toggleStaffStatus);

/**
 * @route   PATCH /api/v1/staff/:id/login
 * @desc    Update last login time
 * @access  Admin
 */
router.patch('/:id/login', staffController.updateLastLogin);

module.exports = router;
