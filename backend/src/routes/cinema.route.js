const express = require('express');
const router = express.Router();
const cinemaController = require('../controllers/cinema.controller');
const auth = require('../middleware/auth.middleware');
const { authorizeAdmin, authorizeUser } = require('../middleware/authorization.middleware');

router.get('/', cinemaController.getAllCinemas);
router.get('/:id', cinemaController.getCinemaById);
router.post('/', auth, authorizeAdmin, cinemaController.createCinema);
router.put('/:id', auth, authorizeAdmin, cinemaController.updateCinema);
router.delete('/:id', auth, authorizeAdmin, cinemaController.deleteCinema);

module.exports = router;
