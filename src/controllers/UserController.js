const AppError = require('../utils/AppError');
const knex = require('../database/knex');
const { hash, compare } = require('bcryptjs');

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body;

    // validate if new email is not registered by other user
    const emailInUse = await knex('users')
      .select('email')
      .where({ email })
      .first();
    if (emailInUse) {
      throw new AppError(
        'Este e-mail já está sendo utilizado por outro usuário.',
        409
      );
    }

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
    
    // verify id provided by request params
    const user = await knex('users').where({ id }).first();
    if (!user) {
      throw new AppError(`Nenhum usuário encontrado com o id = ${id}`, 404);
    }

    // validate if new email is not registered by other user
    const userWithEmail = await knex('users')
      .select('id', 'email')
      .where({ email })
      .first();
    if (userWithEmail && userWithEmail.id !== user.id) {
      throw new AppError(
        'Este e-mail já está sendo utilizado por outro usuário.',
        409
      );
}

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
