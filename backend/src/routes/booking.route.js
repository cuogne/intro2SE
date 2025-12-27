const express = require('express')
const auth = require('../middleware/auth.middleware')
const bookingController = require('../controllers/booking.controller')
const router = express.Router()

router.get('/', auth, bookingController.getBookingByUser)
router.get('/:id', auth, bookingController.getBookingById)
router.post('/reserve', auth, bookingController.reserveSeats) // Giữ ghế 5 phút
router.post('/', auth, bookingController.addBooking)

module.exports = router