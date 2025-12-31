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
const reserveSeats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { showtimeId, seats } = req.body;

    if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'showtimeId and seats are required',
      });
    }

    const result = await bookingService.reserveSeats(userId, showtimeId, seats);

    return res.status(201).json({
      success: true,
      data: {
        bookingId: result.booking._id,
        holdExpiresAt: result.holdExpiresAt,
        expiresInSeconds: result.expiresInSeconds,
        isNewBooking: result.isNewBooking,
        message: result.isNewBooking
          ? 'Seats reserved for 5 minutes'
          : 'Seats added to existing reservation'
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error reserving seats',
      error: error.message,
    });
  }
};

// PATCH /api/v1/bookings/:id/seats
// Body: { action: 'add' | 'remove', seats: [{ row: string, number: number }] }
const updateBookingSeats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: bookingId } = req.params;
    const { action, seats } = req.body;

    if (!action || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'action (add/remove) and seats (array) are required',
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: 'bookingId is required in path params',
      });
    }

    if (action !== 'add' && action !== 'remove') {
      return res.status(400).json({
        success: false,
        message: 'action must be "add" or "remove"',
      });
    }

    const result = await bookingService.updateBookingSeats(userId, bookingId, action, seats);

    if (result.deleted) {
      return res.status(200).json({
        success: true,
        data: {
          deleted: true,
          message: 'Reservation cancelled (no seats remaining)'
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        bookingId: result.booking._id,
        holdExpiresAt: result.holdExpiresAt,
        expiresInSeconds: result.expiresInSeconds,
        message: action === 'add'
          ? 'Seats added to reservation'
          : 'Seats removed from reservation'
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Error updating booking seats',
      error: error.message,
    });
  }
};

module.exports = {
  getBookingById,
  getBookingByUser,
  reserveSeats,
  updateBookingSeats,
};
