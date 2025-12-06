const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtime.controller');

router.get('/', showtimeController.getShowtimes);

module.exports = router;
