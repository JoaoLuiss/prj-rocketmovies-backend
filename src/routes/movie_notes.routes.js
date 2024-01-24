const { Router } = require('express');
const MovieNotesController = require('../controllers/MovieNotesController');

const movieNotesController = new MovieNotesController();

const moviesNotesRoutes = Router();
moviesNotesRoutes.post('/', movieNotesController.create);
moviesNotesRoutes.put('/:id', movieNotesController.update);

module.exports = moviesNotesRoutes;
