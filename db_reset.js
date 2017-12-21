const dbConfig = require('./knexfile');
const knex = require('knex')(dbConfig[process.env.NODE_ENV]);

module.exports = () => knex.migrate.rollback()
  .then(() => knex.migrate.latest());
