const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

require('../models/user.model');
require('../models/movie.model');
require('../models/cinema.model');
require('../models/showtime.model');
require('../models/booking.model');
require('../models/refreshToken.model');
require('../models/staff.model');

const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.error('MONGO_URI is not defined in .env file');
      console.error('Please create a .env file in the backend directory with:');
      console.error('MONGO_URI=your_mongodb_connection_string');
      throw new Error('MONGO_URI is not defined');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
};

module.exports = connectMongoDB;
