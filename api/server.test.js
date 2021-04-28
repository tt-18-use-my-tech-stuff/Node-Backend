const axios = require('axios')

const base_url = 'https://tt18-build-week.herokuapp.com/api'

describe('/api/auth routes', () =>{
  describe('/register', () => {
    const path = '/auth/register'
    it('fails if username or password not provided', async () => {
      let res = await axios.post(base_url + path, {}).catch( err => err.response)

      // axios.post(base_url + path, {})
      //   .then( res => res)
      //   .catch( err => console.log(err))

      expect(res.status).toBe(400)
      expect(res.data.message).toBe('username and password required')
      
      res = await axios.post(base_url + path, {username: 'aoeu'}).catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('username and password required')
      
      res = await axios.post(base_url + path, {password: 'aoeu'}).catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('username and password required')
    })
    it('fails if username not unique', async () => {
      let res = await axios.post(base_url + path, { username: 'bobby', password: 'aoeu' }).catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('username taken')
    })
    it('sends token back', async () => {
      let res = await axios.post(base_url + path, { username: `newUser${Math.random()}`, password: 'aoeu' })
      
      expect(res.status).toBe(201)
      expect(res.data).toHaveProperty('token')
    })
    it('adds user to table', async () => {
      const newUser = {
        username: `${Math.random()}newUser`,
        password: 'aoeu'
      }
      await axios.post(base_url + path, newUser).catch()
  
      let res = await axios.post(base_url + path, newUser).catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('username taken')
    })
    it.todo('should probably test that it adds the email if provided')
  })
  describe('/login', () => {
    const path = '/auth/login'
    it('fails if username or password not provided', async () => {
      let res = await axios.post(base_url + path, {}).catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('username and password required')
      
      res = await axios.post(base_url + path, {username: 'aoeu'}).catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('username and password required')
      
      res = await axios.post(base_url + path, {password: 'aoeu'}).catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('username and password required')
    })
    it('fails if bad username', async () => {
      let res = await axios.post(base_url + path, {username: 'badusername', password: 'aoeu'}).catch( err => err.response)
      expect(res.status).toBe(401)
      expect(res.data.message).toBe('invalid credentials')
    })
    it('fails if bad password', async () => {
      let res = await axios.post(base_url + path, {username: 'bobby', password: 'badpassword'}).catch( err => err.response)
      expect(res.status).toBe(401)
      expect(res.data.message).toBe('invalid credentials')
    })
    it('sends token and proper on success', async () => {
      let res = await axios.post(base_url + path, {username: 'bobby', password: 'aoeu'})
      expect(res.status).toBe(200)
      expect(res.data.message).toBe('Welcome, bobby')
      expect(res.data).toHaveProperty('token')
    })
  })
})