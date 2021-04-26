const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../secret/secret.js')

const {
  checkParamsPresent,
  checkUsernameUnique,
  checkUserExists
} = require('./auth-middleware.js')
const users = require('./auth-model.js')

router.post('/register', checkParamsPresent, checkUsernameUnique, async (req, _, next) => {
  const { username, password, email = null } = req.body

  req.user = await users.insert({
    username,
    password: bcrypt.hashSync(password, 8),
    email
  })
  req.status = 201
  next()
})

router.post("/login", checkParamsPresent, checkUserExists, (req, res, next) => {
  const { password: goodHash } = req.user
  const { password } = req.body
  req.status = 200
  bcrypt.compareSync(password, goodHash)
    ? next()
    : next({ status: 401, message: 'invalid credentials'})
})

router.use( (req, res) => {
  const { user_id, username, email } = req.user
  const payload = {
    subject: user_id,
    username,
    email
  }
  const options = {
    expiresIn: '1d'
  }
  const token = jwt.sign(payload, JWT_SECRET, options)
  res.status(req.status).json({ message: `Welcome, ${username}`, token})
})
module.exports = router

module.exports = router
