const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['manager', 'cashier', 'usher'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'locked'],
        default: 'active'
    },
    avatar: {
        type: String,
        default: null
    },
    initials: {
        type: String,
        trim: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
});

// Index for faster queries
staffSchema.index({ email: 1, code: 1 });
staffSchema.index({ role: 1, status: 1 });

// Pre-save hook: Update updatedAt and generate initials
staffSchema.pre('save', function () {
    this.updatedAt = Date.now();

    // Generate initials from name if not provided
    if (!this.initials && this.name) {
        const nameParts = this.name.trim().split(' ');
        if (nameParts.length >= 2) {
            this.initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        } else {
            this.initials = nameParts[0].substring(0, 2).toUpperCase();
        }
    }
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
