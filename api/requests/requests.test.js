const request = require('supertest');

const server = require('../server.js');
const db = require('../../data/dbconfig');

const headers = {};
const ownerHeaders = {};

const user = { username: 'bobby', password: 'aoeu' };
const owner = { username: 'sally', password: 'aoeu' };
const item1 = {
  item_name: 'TV',
  item_description: 'It be a TV',
  price: 1.0,
  category: 'TVs',
};

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
  let res = await request(server).post('/api/auth/register').send(user);
  headers.Authorization = res.body.token;

  await db.seed.run();
  res = await request(server).post('/api/auth/login').send(owner);
  ownerHeaders.Authorization = res.body.token;
});
beforeEach(async () => {
  await db.seed.run();
});

describe('get api/account/requests/owned', () => {
  const path = '/api/account/requests/owned';

  it('fails no token', async () => {
    let res = await request(server).get(path).set({});
    expect(res.status).toBe(401);
  });
  it('fails invalid token', async () => {
    let res = await request(server)
      .get(path)
      .set({ authorization: 'invalid token' });
    expect(res.status).toBe(401);
  });
  it.todo('gets on good token fails on respons "you have no requests"');
  it('gets on good token', async () => {
    let res = await request(server).get(path).set(headers);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('get api/account/requests', () => {
  const path = '/api/account/requests';

  it('fails no token', async () => {
    let res = await request(server).get(path).set({});
    expect(res.status).toBe(401);
  });
  it('fails invalid token', async () => {
    let res = await request(server)
      .get(path)
      .set({ authorization: 'invalid token' });
    expect(res.status).toBe(401);
  });
  it('gets on good token', async () => {
    let res = await request(server).get(path).set(headers);
    expect(res.status).toBe(200);
    // console.log(53, res.body) // don't know why Array.isArray is returning false
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('post api/requests', () => {
  const path = '/api/requests';
  const newRequest = { item_id: 4 };

  it('fails no token', async () => {
    let res = await request(server).post(path).send(newRequest).set({});
    expect(res.status).toBe(401);
  });
  it('fails invalid token', async () => {
    let res = await request(server)
      .post(path)
      .send(newRequest)
      .set({ authorization: 'invalid token' });
    expect(res.status).toBe(401);
  });
  it('fails no id', async () => {
    let res = await request(server).post(path).send({}).set(headers);
    expect(res.status).toBe(400);
  });
  it('fails invalid id', async () => {
    let res = await request(server)
      .post(path)
      .send({ item_id: 1000000 })
      .set(headers);
    // console.log(76, res.body)
    expect(res.status).toBe(404);
  });
  it('returns new request', async () => {
    let res = await request(server).post(path).send(newRequest).set(headers);
    // console.log(81, res.body)
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('request_id');
    expect(res.body).toHaveProperty('item_id');
    expect(res.body).toHaveProperty('owner_id');
    expect(res.body).toHaveProperty('renter_id');
    expect(res.body).toHaveProperty('status', 'pending');
  });
});

describe('get api/requests/:id', () => {
  const path = '/api/requests/';

  it('fails no token', async () => {
    let res = await request(server)
      .get(path + '1')
      .set({});
    expect(res.status).toBe(401);
  });
  it('fails invalid token', async () => {
    let res = await request(server)
      .get(path + '1')
      .set({ authorization: 'invalid token' });
    expect(res.status).toBe(401);
  });
  it('fails invalid id', async () => {
    let res = await request(server)
      .get(path + '10000000')
      .set(headers);
    expect(res.status).toBe(404);
  });
  it('gets request', async () => {
    let res = await request(server)
      .get(path + '1')
      .set(headers);
    // console.log(path + '1', res.body)
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('request_id');
    expect(res.body).toHaveProperty('item_id');
    expect(res.body).toHaveProperty('owner_id');
    expect(res.body).toHaveProperty('renter_id');
    expect(res.body).toHaveProperty('status');
  });
});

describe('A bunch of request business', () => {

  let res;
  let item_id;
  let request_id;

  beforeEach(async () => {
    // owner makes a tv
    res = await request(server)
      .post('/api/items')
      .set(ownerHeaders)
      .send(item1);
    item_id = res.body.item_id;

    // user requests the tv
    res = await request(server)
      .post('/api/requests')
      .set(headers)
      .send({ item_id });
    let request_id = res.body.request_id;
  })

  it('allows owner to respond to requests', async () => {
    let res;


    // user can cancel the request
    res = await request(server)
      .delete(`/api/requests/${request_id}`)
      .set(headers);
    expect(res.status).toBe(200);

    // user requests again
    res = await request(server)
      .post('/api/requests')
      .set(headers)
      .send({ item_id });
    request_id = res.body.request_id;

    // user cannot accept the request (because he is not the owner)
    

    // owner cannot complete the request (because it hasn't been accepted)
    res = await request(server)
      .put(`/api/requests/${request_id}/respond`)
      .set(ownerHeaders)
      .send({ response: 'completed' });
    expect(res.status).toBe(400);
    res = await request(server).post('/');
  });
});
