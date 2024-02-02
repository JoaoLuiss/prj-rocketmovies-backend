const { Router } = require('express');
const MovieTagsController = require('../controllers/MovieTagsController');

const movieTagsController = new MovieTagsController();

const movieTagsroutes = Router();
movieTagsroutes.post('/', movieTagsController.create);
movieTagsroutes.put('/:id', movieTagsController.update);
movieTagsroutes.delete('/:id', movieTagsController.delete);
movieTagsroutes.get('/:user_id', movieTagsController.index);

module.exports = movieTagsroutes;
