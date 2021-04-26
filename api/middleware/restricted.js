const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../secret/secret");

module.exports = (req, res, next) => {
  next();
};
