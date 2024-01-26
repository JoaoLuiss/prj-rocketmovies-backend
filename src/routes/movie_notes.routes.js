const { Router } = require('express');
const MovieNotesController = require('../controllers/MovieNotesController');

const movieNotesController = new MovieNotesController();

const moviesNotesRoutes = Router();
moviesNotesRoutes.post('/', movieNotesController.create);
moviesNotesRoutes.put('/:id', movieNotesController.update);
moviesNotesRoutes.delete('/:id', movieNotesController.delete);
moviesNotesRoutes.get('/:id', movieNotesController.show);
moviesNotesRoutes.get('/', movieNotesController.index);

module.exports = moviesNotesRoutes;
