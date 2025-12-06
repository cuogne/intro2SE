const mongoose = require('mongoose');
require('dotenv').config();
const movies = require('./data/movie');
const Movie = require('../models/movie.model');

const cinemas = require('./data/cinema');
const Cinema = require('../models/cinema.model');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    // await importMovies();
    await importCimemas();
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
};

const importCimemas = async () => {
  try {
    await Cinema.deleteMany({});
    const insertedCinemas = await Cinema.insertMany(cinemas);
    console.log(`Inserted ${insertedCinemas.length} cinemas into MongoDB`);
    return insertedCinemas; // Return the inserted cinemas with their generated IDs
  } catch (error) {
    console.error('Error importing cinemas:', error);
    throw error;
  }
};

connectMongoDB();
