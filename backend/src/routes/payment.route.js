const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const auth = require('../middleware/auth.middleware');

// zalopay
router.post('/zalopay', auth, paymentController.createZalopayOrder);
router.post('/zalopay/callback', paymentController.handleZalopayCallback);

// momo
router.post('/momo', auth, paymentController.createMoMoOrder);
router.post('/momo/callback', paymentController.handleMoMoCallback);

module.exports = router;
