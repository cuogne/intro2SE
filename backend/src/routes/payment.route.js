const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const auth = require('../middleware/auth.middleware');

// ta o order thanh toan Zalopay (can login)
router.post('/', auth, paymentController.createOrder);

// callback tu Zalopay (thanh toan xong tu dong goi ve)
router.post('/callback', paymentController.handleCallback);

// Kiểm tra trạng thái thanh toán (cần login)
// router.get('/status/:bookingId', auth, paymentController.getPaymentStatus);

module.exports = router;
