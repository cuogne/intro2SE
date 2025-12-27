const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  minutes: { type: Number, required: true },
  genre: { type: [String], required: true },
  releaseDate: { type: Date },
  posterImg: { type: String },
  trailerLink: { type: String },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['now_showing', 'coming_soon', 'ended']
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
