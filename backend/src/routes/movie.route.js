const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const auth = require('../middleware/auth.middleware');
const { authorizeAdmin, authorizeUser } = require('../middleware/authorization.middleware');

router.get('/', movieController.getAllMovies);
router.get('/now_showing', movieController.getNowShowingMovies);
router.get('/coming_soon', movieController.getComingSoonMovies);
router.get('/:id', movieController.getMovieById);

router.post('/', auth, authorizeAdmin, movieController.createMovie);
router.put('/:id', auth, authorizeAdmin, movieController.updateMovie);
router.delete('/:id', auth, authorizeAdmin, movieController.deleteMovie);

module.exports = router;
