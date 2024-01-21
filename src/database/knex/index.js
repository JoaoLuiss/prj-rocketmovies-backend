const knex = require('knex');
const knexfile = rerquire('../../../knexfile.js');

const knexConnection = knex(knexfile.development);

async function knexMigrationsRun() {
  try {
    console.log('Running knex migrations...');
    await knexConnection.migrate.latest();
    console.log('Migrations completed SUCCESSFULLY.');
  } catch (error) {
    console.log('ERROR while running migrations!');
    console.error(error);
  }
}

module.exports = knexConnection;
module.exports.knexMigrationsRun = knexMigrationsRun;
