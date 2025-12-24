const bookingService = require('../services/booking.service');

// GET /api/v1/bookings
const getBookingByUser = async (req, res) => {
  try {
    const userId = req.user.id; // id user login trong token
    const booking = await bookingService.getBookingByUser(userId);

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error getting booking by user',
      error: error.message,
    });
  }
};

// GET /api/v1/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params; // :id
    const currentUser = req.user.id;

    const booking = await bookingService.getBookingById(id, currentUser);

    res.status(200).json({
      success: true,
      data: booking,
    });
  }
  catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error getting booking by id',
      error: error.message,
    });
  }
};

// POST /api/v1/bookings
// Body: { showtimeId: string, seats: [{ row: string, number: number }] }
const addBooking = async (req, res) => {
  try {
    const userId = req.user.id; // id user login trong token
    const { showtimeId, seats } = req.body;

    if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'showtimeId and seats are required',
      });
    }

    const booking = await bookingService.addBooking(userId, showtimeId, seats);

    return res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message,
    });
  }
};

module.exports = {
  getBookingById,
  getBookingByUser,
  addBooking,
};
