const { Router } = require('express');
const MovieNotesController = require('../controllers/MovieNotesController');

const movieNotesController = new MovieNotesController();

const moviesNotesRoutes = Router();
moviesNotesRoutes.post('/', movieNotesController.create);

module.exports = moviesNotesRoutes;
