/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.text('name').notNullable().alter();
    table.text('email').notNullable().alter();
    table.text('password').notNullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('users', (table) => {
    table.text('name').nullable().alter();
    table.text('email').nullable().alter();
    table.text('password').nullable().alter();
  });
};
