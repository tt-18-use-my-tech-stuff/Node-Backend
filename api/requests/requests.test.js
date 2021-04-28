const request = require('supertest')

const server = require('../server.js')
const db = require('../../data/dbconfig')

const headers = {}

const user = { username: 'bobby', password: 'aoeu' }

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
  let res = await request(server).post('/api/auth/register').send(user)
  headers.Authorization = res.body.token
})
beforeEach(async () => {
  await db.seed.run()
})

describe('get api/account/requests/owned', () => {
  const path = '/api/account/requests/owned'

  it('fails no token', async () => {
    let res = await request(server).get(path).set({})
    expect(res.status).toBe(401)
  })
  it('fails invalid token', async () => {
    let res = await request(server).get(path).set({authorization: 'invalid token' })
    expect(res.status).toBe(401)
  })
  it('gets on good token', async () => {
    let res = await request(server).get(path).set(headers)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('get api/account/requests', () => {
  const path = '/api/account/requests/owned'

  it('fails no token', async () => {
    let res = await request(server).get(path).set({})
    expect(res.status).toBe(401)
  })
  it('fails invalid token', async () => {
    let res = await request(server).get(path).set({authorization: 'invalid token' })
    expect(res.status).toBe(401)
  })
  it('gets on good token', async () => {
    let res = await request(server).get(path).set(headers)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('post api/requests', () => {
  const path = '/api/requests'
  const newRequest = { item_id: 4 }

  it('fails no token', async () => {
    let res = await request(server).post(path).send(newRequest).set({})
    expect(res.status).toBe(401)
  })
  it('fails invalid token', async () => {
    let res = await request(server).post(path).send(newRequest).set({authorization: 'invalid token' })
    expect(res.status).toBe(401)
  })
  it('fails no id', async () => {
    let res = await request(server).post(path).send({}).set(headers)
    expect(res.status).toBe(400)
  })
  it('fails invalid id', async () => {
    let res = await request(server).post(path).send({item_id: 1000000}).set(headers)
    expect(res.status).toBe(404)
  })
  it('returns new request', async () => {
    let res = await request(server).post(path).send(newRequest).set(headers)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('request_id')
    expect(res.body).toHaveProperty('item_id')
    expect(res.body).toHaveProperty('owner_id')
    expect(res.body).toHaveProperty('renter_id')
    expect(res.body).toHaveProperty('status', 'pending')
  })

})

describe('get api/requests/:id', () => {
  const path = '/api/requests/'

  it('fails no token', async () => {
    let res = await request(server).get(path + '1').set({})
    expect(res.status).toBe(401)
  })
  it('fails invalid token', async () => {
    let res = await request(server).get(path + '1').set({authorization: 'invalid token' })
    expect(res.status).toBe(401)
  })
  it('fails invalid id', async () => {
    let res = await request(server).get(path + '10000000').set(headers)
    expect(res.status).toBe(404)
  })
  it('gets request', async () => {
    let res = await request(server).get(path + '1').set(headers)
    expect(res.status).toBe(200)
    console.log(106, res.body)
    expect(res.body).toHaveProperty('request_id')
    expect(res.body).toHaveProperty('item_id')
    expect(res.body).toHaveProperty('owner_id')
    expect(res.body).toHaveProperty('renter_id')
    expect(res.body).toHaveProperty('status')
  })
})