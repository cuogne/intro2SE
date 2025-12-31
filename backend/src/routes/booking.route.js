const express = require('express')
const auth = require('../middleware/auth.middleware')
const bookingController = require('../controllers/booking.controller')
const router = express.Router()

router.get('/', auth, bookingController.getBookingByUser)
router.post('/', auth, bookingController.reserveSeats)
router.patch('/:id/seats', auth, bookingController.updateBookingSeats)
router.get('/:id', auth, bookingController.getBookingById)

module.exports = router