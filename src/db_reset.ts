import * as k from 'knex';
import * as Bluebird from 'bluebird';
const knexCleaner = require('knex-cleaner');

const dbConfig = require('../knexfile');
const knex = k(dbConfig[process.env.NODE_ENV]);

module.exports = (): Bluebird<any> => knexCleaner.clean(knex);
