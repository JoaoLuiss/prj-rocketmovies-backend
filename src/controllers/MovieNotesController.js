const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const Validator = require('../utils/Validator');

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, user_id } = request.body;
    const validator = new Validator();

    // validate user_id — must exist
    await validator.validateUser(user_id);

    // validate rating — must be an integer between 0 and 5
    const filteredRating = validator.validateRating(rating);

    // insert new movie_note on database
    await knex('movie_notes').insert({
      title,
      description,
      rating: filteredRating,
      user_id,
    });

    return response.json();
  }
}

module.exports = MovieNotesController;
