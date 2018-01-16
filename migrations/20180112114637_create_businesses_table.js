exports.up = knex => knex.schema.createTable('businesses', (t) => {
  t.uuid('id').primary();
  t.text('name').notNullable();
  t.text('address_1').notNullable();
  t.text('address_2');
  t.text('city').notNullable();
  t.text('state').notNullable();
  t.text('zip').notNullable();
  t.text('country').notNullable();
  t.timestamps();
});

exports.down = knex => knex.schema.dropTable('businesses');
