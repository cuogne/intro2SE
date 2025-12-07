const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');

router.get('/', movieController.getAllMovies);
router.get('/now_showing', movieController.getNowShowingMovies);
router.get('/coming_soon', movieController.getComingSoonMovies);
router.get('/:id', movieController.getMovieById);
router.post('/', movieController.createMovie);
router.put('/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
