const { Router } = require('express');
const usersRoutes = require('./users.routes');
const moviesNotesRoutes = require('./movie_notes.routes');
const movieTagsroutes = require('./movie_tags.routes');

const routes = Router();
routes.use('/users', usersRoutes);
routes.use('/movie_notes', moviesNotesRoutes);
routes.use('/movie_tags', movieTagsroutes);

module.exports = routes;
