const mongoose = require('mongoose');
require('dotenv').config();
const movies = require('./data/movie');
const Movie = require('../models/movie.model');

const cinemas = require('./data/cinema');
const Cinema = require('../models/cinema.model');

const Showtime = require('../models/showtime.model');
const generateShowtimes = require('./data/showtime')

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // await importMovies();
    // await importCinemas();
    await generateShowtimes();

    console.log('✅ All data imported successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const importMovies = async () => {
  try {
    await Movie.deleteMany({});
    const insertedMovies = await Movie.insertMany(movies);
    console.log(`✅ Inserted ${insertedMovies.length} movies into MongoDB`);
    return insertedMovies; // Return with generated IDs
  } catch (error) {
    console.error('Error importing movies:', error);
    throw error;
  }
};

const importCinemas = async () => {
  try {
    await Cinema.deleteMany({});
    const insertedCinemas = await Cinema.insertMany(cinemas);
    console.log(`✅ Inserted ${insertedCinemas.length} cinemas into MongoDB`);
    return insertedCinemas; // Return the inserted cinemas with their generated IDs
  } catch (error) {
    console.error('Error importing cinemas:', error);
    throw error;
  }
};

connectMongoDB();
