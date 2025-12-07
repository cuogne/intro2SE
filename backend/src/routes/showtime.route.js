const express = require('express')
const router = express.Router()
const showtimeController = require('../controllers/showtime.controller')
const auth = require('../middleware/auth.middleware');
const { authorizeAdmin, authorizeUser } = require('../middleware/authorization.middleware');

router.get('/', showtimeController.getShowtimes)
router.get('/:id', showtimeController.getShowtimeById)
router.post('/', auth, authorizeAdmin, showtimeController.createShowtime)
router.put('/:id', auth, authorizeAdmin, showtimeController.updateShowtime)
router.delete('/:id', auth, authorizeAdmin, showtimeController.deleteShowtime)

module.exports = router