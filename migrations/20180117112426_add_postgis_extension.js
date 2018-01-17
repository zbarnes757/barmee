
exports.up = knex => knex.schema.raw('CREATE EXTENSION IF NOT EXISTS postgis');

exports.down = knex => knex.schema.raw('DROP EXTENSION IF EXISTS postgis');
