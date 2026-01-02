const paymentService = require('../services/payment.service');
const Booking = require('../models/booking.model');

// POST /api/v1/payments
// Tạo order thanh toán Zalopay từ booking
const createZalopayOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'bookingId is required'
      });
    }

    const booking = await Booking.findOne({ _id: bookingId, user: userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not authorized'
      });
    }

    const result = await paymentService.createZalopayOrder(bookingId);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating payment order',
      error: error.message
    });
  }
};

// POST /api/v1/payments/callback
// Callback từ Zalopay (Zalopay tự động gọi endpoint này)
// Zalopay gửi: { data: "...", mac: "..." }
const handleZalopayCallback = async (req, res) => {
  try {
    // Zalopay gửi callback với format: { data: "...", mac: "..." }
    const dataStr = req.body.data;
    const reqMac = req.body.mac;

    if (!dataStr || !reqMac) {
      console.error('Missing data or mac in callback');
      return res.status(200).json({
        return_code: -1,
        return_message: 'Missing data or mac'
      });
    }

    const result = await paymentService.handleCallback(dataStr, reqMac);

    res.status(200).json(result);
  } catch (error) {
    console.error('=== Payment callback error ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('Callback body:', JSON.stringify(req.body, null, 2));

    // Trả về lỗi để Zalopay callback lại (tối đa 3 lần)
    res.status(200).json({
      return_code: 0,
      return_message: error.message
    });
  }
}

// MOMO
const createMoMoOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ success: false, message: 'bookingId is required' });

    const result = await paymentService.createMomoOrder(bookingId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const handleMoMoCallback = async (req, res) => {
  try {
    await paymentService.handleMomoCallback(req.body);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createZalopayOrder,
  handleZalopayCallback,
  createMoMoOrder,
  handleMoMoCallback,
};
