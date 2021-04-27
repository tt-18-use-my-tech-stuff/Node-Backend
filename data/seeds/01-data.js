const bcrypt = require('bcryptjs')
// DO NOT CHANGE THIS FILE
// I'm changing it :) if it breaks you can blame Matthew
exports.seed = async knex => {
  await knex('users').del();
  return knex('users').insert([
    { username: 'bobby', password: bcrypt.hashSync('aoeu', 8) },
    { username: 'sally', password: bcrypt.hashSync('aoeu', 8) },
    { username: 'joey', password: bcrypt.hashSync('aoeu', 8), email: 'joeyisthebest@mail.com' }
  ]);
}
