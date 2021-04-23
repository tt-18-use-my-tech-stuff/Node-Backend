// DO NOT CHANGE THIS FILE
exports.seed = async function (knex) {
  await knex('users').truncate();
  await knex('users').insert([
    {
      username: 'foo'
    }
  ]);
}
