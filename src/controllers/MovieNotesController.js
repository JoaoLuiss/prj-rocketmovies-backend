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

  async update(request, response) {
    const { title, description, rating, user_id } = request.body;
    const { id } = request.params;
    const validator = new Validator();

    // validate user_id
    await validator.validateUser(user_id);

    // validate if note id is related to the user_id
    await validator.validateRelationshipNoteIdAndUserId(id, user_id);

    // validate rating
    const filteredRating = validator.validateRating(rating);

    // update movie_note on database
    await knex('movie_notes').where({ id }).update({
      title,
      description,
      rating: filteredRating,
      updated_at: knex.fn.now(),
    });

    return response.json();
  }

  async delete(request, response) {
    const { id } = request.params;
    const validator = new Validator();

    // Validate movie_notes {id}
    await validator.validateNoteId(id);

    // Delete respective movie_note from the database
    await knex('movie_notes').where({ id }).first().del();

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;
    const validator = new Validator();

    // Validate movie_notes {id}
    const note = await validator.validateNoteId(id);

    return response.json(note);
  }

  async index(request, response) {
    const { user_id } = request.query;
    const validator = new Validator();

    // Validate user_id
    await validator.validateUser(user_id);

    // Search all notes associated with that user
    const notes = await knex('movie_notes').where({ user_id });

    return response.json(notes);
  }
}

module.exports = MovieNotesController;
