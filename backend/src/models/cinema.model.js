const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
    row: { type: String, required: true }, // hàng ghế: a,b,c
    number: { type: Number, required: true }, // số ghế: 1,2,3
    type: { type: String, default: 'standard' },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // phòng chiếu
  seatLayout: [seatSchema],
});

const cinemaSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    address: { type: String },
    rooms: [roomSchema],
  },
  { timestamps: true }
);

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
