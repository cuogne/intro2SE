const express = require('express')
const auth = require('../middleware/auth.middleware')
const bookingController = require('../controllers/booking.controller')
const router = express.Router()

router.get('/my-booking', auth, bookingController.getBookingByUser)
router.get('/my-booking/:id_book', auth, bookingController.getBookingById)
router.post('/', auth, bookingController.addBooking)

module.exports = router