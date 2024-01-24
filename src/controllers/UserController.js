const AppError = require('../utils/AppError');
const knex = require('../database/knex');
const { hash, compare } = require('bcryptjs');
const Validator = require('../utils/Validator');

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const validator = new Validator();

    // validate if the new email is available to be registred
    await validator.validateEmail(email);

    const hashedPassword = await hash(password, 8);

    await knex('users').insert({
      name,
      email,
      password: hashedPassword,
    });

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, new_password } = request.body;
    const { id } = request.params;
    const validator = new Validator();

    // verify id provided by request params
    const user = await knex('users').where({ id }).first();
    if (!user) {
      throw new AppError(`Nenhum usuário encontrado com o id = ${id}`, 404);
    }

    // validate if new email is not registered by another user
    await validator.validateEmail(email, id);

    // validate password
    if (new_password && !password) {
      throw new AppError('A senha antiga precisa ser informada.', 401);
    }
    if (new_password && password) {
      const passwordCorrect = await compare(password, user.password);
      if (!passwordCorrect) {
        throw new AppError(
          'A senha informada está incorreta. Verifique e tente novamente.',
          401
        );
      } else {
        const hashedPassword = await hash(new_password, 8);
        user.password = hashedPassword;
      }
    }

    // update new data in databse
    user.email = email ?? user.email;
    user.name = name ?? user.name;
    user.updated_at = knex.fn.now();
    await knex('users').where({ id }).update(user);

    return response.json();
  }
}

module.exports = UserController;
