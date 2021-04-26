const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../secrets");
const User = require('../users/users-model');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next({ status: 401, message: "token required" });
  }
  else {
    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        next({ status: 401, message: "token invalid"});
      }
      else {
        req.decodedToken = decodedToken;
        req.user = await User.findBy({ username: decodedToken.username });
        next();
      }
    })
  }
};
