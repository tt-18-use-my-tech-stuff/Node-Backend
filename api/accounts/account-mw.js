function checkParamsExist(req, res, next){
    const { username, password } = req.body

    const usernameValid = typeof(username) === 'string' && username.length > 0
    const passwordValid = typeof(password) === 'string' && password.length > 0
  
    usernameValid || passwordValid
      ? next()
      : next({ status: 400, message: 'username or password required'})
}

module.exports = {checkParamsExist}