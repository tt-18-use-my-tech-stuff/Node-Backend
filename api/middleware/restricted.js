const jwt = require('jsonwebtoken')

const { getById: getRequestById } = require('../requests/requests-model.js')

const { JWT_SECRET } = require('../secret/secret.js')

module.exports = {
  accountRequired,
  onlyCreaterX
}

function accountRequired(req, res, next){
  const token = req.headers.authorization

  !token
    ? next({ status: 401, message: 'Token required' })
    : jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err){
          next({ status: 401, message: `Token invalid` })
        } else {
          req.decodedToken = decoded
          next()
        }
  })
}

// only the creater of an item or request can change it
function onlyCreaterX(creater){
  return (req, res, next) => {
    const id = req.decodedToken.subject
    id === req.request[`${creater}_id`]
      ? next()
      : next({ status: 403, message: 'You did not make this request'})
  }
}
