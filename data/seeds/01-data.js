const bcrypt = require('bcryptjs')
// DO NOT CHANGE THIS FILE
// I'm changing it :) if it breaks you can blame Matthew
exports.seed = async function (knex) {
  await knex('users').truncate();
  await knex('users').insert([
    { username: 'bobby', password: bcrypt.hashSync('aoeu', 8) }
  ]);
}
