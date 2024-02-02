const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const Validator = require('../utils/Validator');

class MovieTagsController {
  async create(request, response) {
    const { name, note_id, user_id } = request.body;
    const validator = new Validator();

    // Validate name - not nullable
    if (!name) {
      throw new AppError('O nome da tag deve ser informado.', 400);
    }

    // Validate note_id and user_id - the relationship between them
    await validator.validateRelationshipNoteIdAndUserId(note_id, user_id);

    // Insert the new valid tag into the database
    await knex('movie_tags').insert({ name, note_id, user_id });

    return response.json();
  }

  async update(request, response) {
    const { name } = request.body;
    const { id } = request.params;

    // Validate id
    const tag = await knex('movie_tags').where({ id }).first();
    if (!tag) {
      throw new AppError(`Não foi encontrada nenhuma tag com o id = {${id}}`);
    }

    // Validate name
    if (!name || name === '') {
      throw new AppError('É necessário preencher o nome.');
    }

    // Update on database
    await knex('movie_tags').where({ id }).update({ name });

    return response.json();
  }

  async delete(request, response) {
    const { id } = request.params;

    // Validate id
    const tag = await knex('movie_tags').where({ id }).first();
    if (!tag) {
      throw new AppError(`Não foi encontrada nenhuma tag com o id = {${id}}`);
    }

    // Delete on database
    await knex('movie_tags').where({ id }).delete();

    return response.json();
  }

  async index(request, response) {
    const { user_id } = request.params;

    const tags = await knex('movie_tags').where({ user_id }).orderBy('name');

    return response.json(tags);
  }
}

module.exports = MovieTagsController;
