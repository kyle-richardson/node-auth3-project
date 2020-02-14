const bcrypt = require('bcryptjs')

exports.seed = function(knex) {
  return knex('users').insert([
    {username: 'test1', password: bcrypt.hashSync('test1', 14)},
    {username: 'test2', password: bcrypt.hashSync('test2', 14)},
    {username: 'test3', password: bcrypt.hashSync('test3', 14)},
  ]);
};
