const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  address: { type: String },
  rows: { type: Number, required: true },
  columns: { type: Number, required: true },
  seatLayout: [{
      row: { type: String, required: true },
      seats: [{ type: String, required: true }]
    }],
});

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
