const mongoose = require('mongoose');
require('dotenv').config();
const movies = require('../data/movie');
const Movie = require('../models/movie.model');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // await importMovies();

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

const importMovies = async () => {
  try {
    await Movie.deleteMany({});
    await Movie.insertMany(movies);
    console.log(`Inserted ${movies.length} movies into MongoDB`);
  } catch (error) {
    console.error('Error importing movies:', error);
    throw error;
  }
}

module.exports = { connectMongoDB };