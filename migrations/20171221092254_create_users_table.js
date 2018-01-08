exports.up = knex => knex.schema.createTable('users', (t) => {
  t.uuid('id').primary();
  t.string('email').unique().index().notNullable();
  t.string('password').notNullable();
  t.timestamps();
});

exports.down = knex => knex.schema.dropTable('users');
