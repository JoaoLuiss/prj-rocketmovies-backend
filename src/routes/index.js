const { Router } = require('express');
const usersRoutes = require('./users.routes');
const moviesNotesRoutes = require('./movie_notes.routes');

const routes = Router();
routes.use('/users', usersRoutes);
routes.use('/movie_notes', moviesNotesRoutes);

module.exports = routes;
