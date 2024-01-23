const knex = require('../database/knex');
const AppError = require('../utils/AppError');

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating, user_id } = request.body;

    // validate user_id — must exist
    const user = await knex('users').where({ id: user_id }).first();
    if (!user) {
      throw new AppError(`Nenhum usuário encontrado o id = ${user_id}`, 404);
    }

    // validate rating — must be an integer between 0 and 5
    const filteredRating = Number.parseFloat(rating);
    if (
      !Number.isInteger(filteredRating) ||
      filteredRating > 5 ||
      filteredRating < 0
    ) {
      throw new AppError(
        'A avaliação deve ser um número inteiro entre 0 e 5.',
        422
      );
    }

    // insert new movie note on database
    await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id,
    });

    return response.json();
  }
}

module.exports = MovieNotesController;
