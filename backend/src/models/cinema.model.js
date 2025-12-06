const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  address: { type: String },
  seatLayout: [{
      row: { type: String, required: true },
      number: { type: Number, required: true },
      type: { type: String, default: 'standard' },
    }],
});

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
