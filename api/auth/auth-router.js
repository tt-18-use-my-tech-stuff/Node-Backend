const router = require('express').Router()
const bcrypt = require('bcryptjs')

const {
  checkParamsPresent,
  checkUsernameUnique,
  checkUserExists
} = require('./auth-middleware.js')
const users = require('./auth-model.js')

router.post('/register', checkParamsPresent, checkUsernameUnique, async (req, res) => {
  const { username, password, email = null } = req.body

  const user = await users.insert({
    username,
    password: bcrypt.hashSync(password, 8),
    email
  })
  res.status(201).json(user)
})

module.exports = router
