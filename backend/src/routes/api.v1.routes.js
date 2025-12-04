const express = require('express');
const router = express.Router();

// Simple GET endpoint
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API v1 is working!',
        data: {
            version: '1.0.0',
            timestamp: new Date().toISOString()
        }
    });
});

module.exports = router;

