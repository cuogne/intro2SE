const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // trong cai showtime nay da co thong tin ve phim, rap, thoi gian chieu
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  seat: {
    row: { type: String, required: true },
    number: { type: Number, required: true },
  },

  price: { type: Number, required: true },

  bookedAt: { type: Date, default: Date.now },
});

bookingSchema.index({ showtime: 1, 'seat.row': 1, 'seat.number': 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;