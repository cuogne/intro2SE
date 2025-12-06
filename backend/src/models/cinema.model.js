const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  name: String,
  address: String,
  totalRooms: Number,
});

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
