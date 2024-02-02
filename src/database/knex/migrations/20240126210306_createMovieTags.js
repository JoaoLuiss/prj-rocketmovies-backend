/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('movie_tags', (table) => {
    table.increments('id');
    table.text('name').notNullable();

    table
      .integer('note_id')
      .references('id')
      .inTable('movie_notes')
      .notNullable();
    table.integer('user_id').references('id').inTable('users').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('movie_tags');
};
