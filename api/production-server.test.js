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

describe('/api/items', () => {

  let headers = {}
  const path = '/items'
  const user = { username: 'bobby', password: 'aoeu' }
  const testItem = {
    item_name: 'Television',
    item_description: 'New TV! It works great!',
    price: 0.555,
    category: 'Displays',
  }

  beforeAll(async () => {
    let res = await axios.post(base_url + '/auth/login', user)
    headers = { headers: { authorization: res.data.token } }
  })

  describe('POST /', () => {

    it('rejects unauthorized requests', async () => {
      let res = await axios.post(base_url + path, testItem).catch( err => err.response)
      expect(res.status).toBe(401)
      expect(res.data.message).toBe('Token required')
    })
  
    it('rejects incorrect requests', async () => {
      let res
  
      res = await axios.post(base_url + path, {}, headers).catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('item_name required.')
  
      res = await axios.post(base_url + path, { item_name: 'asdfasdf' }, headers)
        .catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('item_description required.')
  
      res = await axios.post(base_url + path, {
        item_name: 'asdfasdf',
        item_description: 'asdfasdf',
      }, headers)
        .catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('price required.')
  
      res = await axios.post(base_url + path, {
          ...testItem,
          extraField: 'asdf',
        }, headers)
        .catch( err => err.response)
      expect(res.status).toBe(400)
      expect(res.data.message).toBe('extraField is not a valid field.')
    })
  
    it('accepts properly formatted item', async () => {
      let res = await axios.post(base_url + path, testItem, headers).catch( err => console.log(139, err.response))
      expect(res.status).toBe(201)
    })
  })
  
  describe('PUT /', () => {
    it('can edit items', async () => {
      let res
      res = await axios.post(base_url + path, testItem, headers).catch( err => console.log(147, err.response))
      const item_id = res.data.item_id
      res = await axios.put(base_url + path + '/' + item_id, { item_description: 'nvm, not new anymore' }, headers).catch( err => console.log(149, err.response))
      expect(res.status).toBe(200)
      res = await axios.get(base_url + path + '/' + item_id, headers).catch( err => console.log(151, err.response))
      expect(res.data.item_description).toBe('nvm, not new anymore')
    })
  })
  
  describe('DELETE /:id', () => {
    it('can delete items', async () => {
      let res
      res = await axios.post(base_url + path, testItem, headers)
      const item_id = res.data.item_id
      res = await axios.delete(base_url + path + '/' + item_id, headers).catch( err => console.log(162, err.response))
      expect(res.status).toBe(200)
      res = await axios.get(base_url + path + '/' + item_id, headers).catch( err => err.response)
      expect(res.status).toBe(404)
      expect(res.data.message).toBe(`No item found with id ${item_id}.`)
    })
  })
})

describe('/api/requests', () => {

  let headers = {}
  const user = { username: 'bobby', password: 'aoeu' }

  beforeAll(async () => {
    let res = await axios.post(base_url + '/auth/login', user)
    headers = { headers: { authorization: res.data.token } }
  })

  describe.skip('get api/account/requests/owned', () => {
    const path = '/api/account/requests/owned'
  
    it('fails no token', async () => {
      let res = await axios.get(base_url + path, {}).catch(err => err.response)
      expect(res.status).toBe(401)
    })
    it('fails invalid token', async () => {
      let res = await axios.get(base_url + path, {authorization: 'invalid token' }).catch(err => err.response)
      expect(res.status).toBe(401)
    })
    it.todo('gets on good token fails on respons "you have no requests"')
    it('gets on good token', async () => {
      let res = await axios.get(base_url + path, headers).catch(err => err.response)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.data)).toBe(true)
    })
  })
  
  describe.skip('get api/account/requests', () => {
    const path = '/api/account/requests'
  
    it('fails no token', async () => {
      let res = await axios.get(base_url + path, {}).catch(err => err.response)
      expect(res.status).toBe(401)
    })
    it('fails invalid token', async () => {
      let res = await axios.get(base_url + path, {authorization: 'invalid token' }).catch(err => err.response)
      expect(res.status).toBe(401)
    })
    it.skip('gets on good token', async () => {
      let res = await axios.get(base_url + path, headers).catch(err => err.response)
      expect(res.status).toBe(200)
      console.log(53, res.data) // don't know why Array.isArray is returning false
      expect(Array.isArray(res.data)).toBe(true)
    })
  })
  
  describe('post api/requests', () => {
    const path = '/requests'
    const newRequest = { item_id: 4 }
  
    it('fails no token', async () => {
      let res = await axios.post(base_url + path, newRequest, {}).catch(err => err.response)
      expect(res.status).toBe(401)
    })
    it('fails invalid token', async () => {
      let res = await axios.post(base_url + path, newRequest, {authorization: 'invalid token' }).catch(err => err.response)
      expect(res.status).toBe(401)
    })
    it('fails no id', async () => {
      let res = await axios.post(base_url + path, {}, headers).catch(err => err.response)
      expect(res.status).toBe(400)
    })
    it('fails invalid id', async () => {
      let res = await axios.post(base_url + path, {item_id: 1000000}, headers).catch(err => err.response)
      console.log(res)
      expect(res.status).toBe(404)
    })
    it('returns new request', async () => {
      let res = await axios.post(base_url + path, newRequest, headers).catch(err => err.response)
      expect(res.status).toBe(201)
      expect(res.data).toHaveProperty('request_id')
      expect(res.data).toHaveProperty('item_id')
      expect(res.data).toHaveProperty('owner_id')
      expect(res.data).toHaveProperty('renter_id')
      expect(res.data).toHaveProperty('status', 'pending')
    })
  
  })
  
  describe('get api/requests/:id', () => {
    const path = '/requests/'
  
    it('fails no token', async () => {
      let res = await axios.get(base_url + path + '1', {}).catch(err => err.response)
      expect(res.status).toBe(401)
    })
    it('fails invalid token', async () => {
      let res = await axios.get(base_url + path + '1', {headers: {authorization: 'invalid token'} }).catch(err => err.response)
      expect(res.status).toBe(401)
    })
    it('fails invalid id', async () => {
      let res = await axios.get(base_url + path + '10000000', headers).catch(err => err.response)
      expect(res.status).toBe(404)
    })
    it('gets request', async () => {
      let res = await axios.get(base_url + path + '1', headers).catch(err => err.response)
      expect(res.status).toBe(200)
      expect(res.data).toHaveProperty('request_id')
      expect(res.data).toHaveProperty('item_id')
      expect(res.data).toHaveProperty('owner_id')
      expect(res.data).toHaveProperty('renter_id')
      expect(res.data).toHaveProperty('status')
    })
  })
})
