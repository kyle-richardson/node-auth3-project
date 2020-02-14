const bcrypt = require('bcryptjs')

exports.seed = function(knex) {
  return knex('users').insert([
    {username: 'test1', password: bcrypt.hashSync('test1', 14), department: 'faculty'},
    {username: 'test2', password: bcrypt.hashSync('test2', 14), department: 'student'},
    {username: 'test3', password: bcrypt.hashSync('test3', 14), department: 'faculty'},
  ]);
};
