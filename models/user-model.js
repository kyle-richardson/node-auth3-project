const knex = require('knex');
const knexConfig = require('../knexfile.js');
const db = knex(knexConfig.development);

module.exports = {
  getUsers,
  findBy,
  findAllBy,
  add,
  remove,
  update
};

function getUsers() {
    return db('users')
      .select('id', 'username', 'department')
}

function findBy(filter) {
    return db('users')
      .select('id', 'username','password', 'department')
      .where(filter)
      .first()
}

function findAllBy(filter) {
  return db('users')
    .select('id', 'username','department')
    .where(filter)
}

function add(user) {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      const [id] = ids;
      return findBy({id});
    });
}

async function remove(userId) {
  const userToDelete = await findBy({id: userId})
  return await db('users')
    .where('users.id', userId)
    .del()
    .then(prom => {
      if(prom===1)
        return userToDelete
      else return prom
    })
}

function update(id, changes) {
  return db('users')
    .where('users.id', id)
    .update(changes)
    .then(prom => {
        if(prom>0)
            return findBy({id});
        else
            return prom
      });
}



