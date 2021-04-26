const jwt = require('jsonwebtoken')

const { JWT_SECRET } = require('../secret/secret.js')

module.exports = {
  accountRequired,
  ownerOnly,
  renterOnly
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

// only the owner can accept a request
function ownerOnly(req, res, next){

}

// only the renter can cancel a request
function renterOnly(req, res, next){

}
