const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  cinema: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema', required: true },
  
  startTime: { type: Date, required: true, index: true },

  price: {type: Number, default: 45000},

  totalSeats: { type: Number, required: true },

  availableSeats: {type: Number, required: true },

  seats: [{
    _id: false, 
    row: String,
    number: Number,
    isBooked: { type: Boolean, default: false },
  }]
});

showtimeSchema.index({ movie: 1, cinema: 1, startTime: 1 });

const Showtime = mongoose.model('Showtime', showtimeSchema);
module.exports = Showtime;