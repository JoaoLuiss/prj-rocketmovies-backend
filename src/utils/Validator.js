const AppError = require('./AppError');
const knex = require('../database/knex');

class Validator {
  /**
   * Validates a rating.
   *
   * @param {number|string} rating The rating to be validated.
   * @returns {number} The validated rating as an integer between 0 and 5.
   * @throws {AppError} Throws an error if the rating is not valid.
   */
  validateRating(rating) {
    // Convert the rating to a floating-point number
    if (typeof rating === 'string') {
      rating = Number.parseFloat(rating);
    }

    // Check if the rating is an integer between 0 and 5
    if (!Number.isInteger(rating) || rating > 5 || rating < 0) {
      // Throws an error if the rating is not valid
      throw new AppError(
        'A avaliação deve ser um número inteiro entre 0 e 5.',
        422
      );
    }

    // Returns the validated rating
    return rating;
  }

  /**
   * Validates a user by ID.
   *
   * @async  because it interact with the database
   * @function
   * @param {number} user_id - The ID of the user to validate.
   * @throws {AppError} If the user is not found, an error is thrown with status 404.
   * @returns {Promise<Object>} An object representing the validated user.
   */
  async validateUser(user_id) {
    // Query the user from the database.
    const user = await knex('users').where({ id: user_id }).first();

    // If the user is not found, throw an error.
    if (!user) {
      throw new AppError(
        `Não foi encontrado usuário com o id = ${user_id}`,
        404
      );
    }

    // Return the validated user.
    return user;
  }

  /**
   * Validates whether an email is already in use by another user.
   *
   * @async
   * @function
   * @param {string} email The email to be validated.
   * @param {string|number} [user_id] The optional ID of the user to exclude from the validation.
   * @throws {AppError} Throws an error if the email is already in use by another user.
   * @return {Promise<void>} A void promise that resolves if the email is not in use.
   */
  async validateEmail(email, user_id) {
    const query = await knex('users').select('id', 'email');

    if (user_id) {
      query.whereNot({ id: user_id });
    }

    const userWithEmail = await query.where({ email }).first();

    if (userWithEmail) {
      throw new AppError(
        'Este e-mail já está registrado por um outro usuário.',
        409
      );
    }
  }

  /**
   * Validate an id of the movie_notes table
   *
   * @async
   * @function
   * @param {string|number} note_id The id to be validated.
   * @throws {AppError} If no note is found with the provided id.
   * @returns {Promise} If id is valid, returns an object representing the note with the provided id.
   */
  async validateNoteId(note_id) {
    const note = await knex('movie_notes').where({ id: note_id }).first();
    if (!note) {
      throw new AppError(`Nenhuma nota encontrada com o id = {${note_id}}`);
    }

    return note;
  }

  /**
   * Validates if the note_id and the user_id are related in any movie_notes register.
   *
   * @async
   * @param {number} note_id Note id to check registration and relationship.
   * @param {number} user_id User id to check registration and relationship.
   * @throws {AppError} Throws an error if no note is found related to the user_id.
   * @returns {Promise<Object>} A Promise that resolves to an object representing the note associated with the user_id.
   */
  async validateRelationshipNoteIdAndUserId(note_id, user_id) {
    const note = await knex('movie_notes')
      .where({ id: note_id })
      .andWhere({ user_id })
      .first();
    if (!note) {
      throw new AppError(
        `Não foi encontrada uma nota de id = {${id}} relacionada a um usuário de id = {${user_id}}`
      );
    }

    return note;
  }
}

module.exports = Validator;
