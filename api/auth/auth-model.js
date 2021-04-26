const db = require('../../data/dbconfig.js')

module.exports = {
  getById,
  getByUsername,
  insert,
  del,
}

function getById(user_id){
  return db('users')
    .where({user_id})
    .first()
}

function getByUsername(username){
  return db('users')
    .where({username})
    .first()
}

async function insert(user){
  const [id] = await db('users').insert(user)
  return getById(id)
}

function del(user_id){
  return db('users')
    .where({user_id})
    .del()
}
