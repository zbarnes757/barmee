const NODE_ENV = process.env.NODE_ENV || 'development';
const dbconfig = require('./knexfile');
const knex = require('knex')(dbconfig[NODE_ENV]);
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin(require('bookshelf-uuid'))
bookshelf.plugin('visibility');

module.exports = bookshelf;
