import * as k from 'knex';
const knexCleaner = require('knex-cleaner');

const dbConfig = require('../knexfile');
const knex = k(dbConfig[process.env.NODE_ENV]);

module.exports = () => knexCleaner.clean(knex);
