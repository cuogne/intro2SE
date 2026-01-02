const express = require('express')
const auth = require('../middleware/auth.middleware')
const { authorizeAdmin } = require('../middleware/authorization.middleware')
const bookingController = require('../controllers/booking.controller')
const router = express.Router()

router.get('/me', auth, bookingController.getBookingByUser) // lay booking cua user dang login

router.get('/all', auth, authorizeAdmin, bookingController.getAllBookings) // lay tat ca booking (admin only)
router.get('/revenue', auth, authorizeAdmin, bookingController.getTotalRevenue) // lay doanh thu (admin only)
router.get('/statistics', auth, authorizeAdmin, bookingController.getBookingStatistics) // thong ke chi tiet (admin only)

router.post('/', auth, bookingController.reserveSeats) // tao booking giu ghe
router.patch('/:id/seats', auth, bookingController.updateBookingSeats) // cap nhat ghe da dat
router.get('/:id', auth, bookingController.getBookingById) // lay booking theo id

module.exports = router