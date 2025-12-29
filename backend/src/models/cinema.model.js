const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  address: { type: String },
  status: { type: String, default: 'open' }, //open, closed, renovating
  type: { type: String, default: '2dstandard' }, //2dstandard, 3dvip, imax
  capacity: { type: Number, default: 100 },
  seatRows: { type: Number, default: 7 }, //number of rows
  seatsCols: { type: Number, default: 10 },//number of columns
  seatLayout: [{
      row: { type: String, required: true },
      seats: [{ type: String, required: true }]
    }],
});

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
