const express = require('express')
const router = express.Router()
const showtimeController = require('../controllers/showtime.controller')

router.get('/', showtimeController.getShowtimes)
router.get('/:id', showtimeController.getShowtimeById)
router.post('/', showtimeController.createShowtime)
router.put('/:id', showtimeController.updateShowtime)
router.delete('/:id', showtimeController.deleteShowtime)

module.exports = router