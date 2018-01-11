const dbConfig = require('./knexfile');
import * as k from 'knex';
const knex = k(dbConfig[process.env.NODE_ENV]);

module.exports = () => knex.migrate.rollback()
  .then(() => knex.migrate.latest());
