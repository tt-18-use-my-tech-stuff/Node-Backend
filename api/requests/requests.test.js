const request = require('supertest');

const server = require('../server.js');
const db = require('../../data/dbconfig');

const headers = {};
const owner_headers = {};
const user2_headers = {};

const user = { username: 'bobby', password: 'aoeu' };
const user2 = { username: 'user2', password: 'test' };
const owner = { username: 'owner', password: 'test' };
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

describe('put api/requests/:request_id/respond', () => {

  it('can do request response stuff', async () => {
    let res;
    let item_id;
    let request1_id;
    let request2_id;

    // register owner
    res = await request(server).post('/api/auth/register').send(owner);
    owner_headers.Authorization = res.body.token;

    // register user2
    res = await request(server).post('/api/auth/register').send(user2);
    user2_headers.Authorization = res.body.token;

    // owner posts a tv
    res = await request(server)
      .post('/api/items')
      .set(owner_headers)
      .send(item1);
    expect(res.status).toBe(201);
    item_id = res.body.item_id;

    // user 1 requests the tv
    res = await request(server)
      .post('/api/requests')
      .set(headers)
      .send({ item_id });
    expect(res.status).toBe(201);
    request1_id = res.body.request_id;

    // owner fails to complete the request (because it's not accepted yet)
    res = await request(server)
      .put(`/api/requests/${request1_id}/respond`)
      .set(owner_headers)
      .send({ response: 'completed' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Cannot complete a request that is not accepted.');

    // owner successfully accepts a request
    res = await request(server)
      .put(`/api/requests/${request1_id}/respond`)
      .set(owner_headers)
      .send({ response: 'accepted' });
    expect(res.status).toBe(200);

    // user 2 requests the tv
    res = await request(server)
      .post('/api/requests')
      .set(user2_headers)
      .send({ item_id });
    expect(res.status).toBe(201);
    request2_id = res.body.request_id;

    // owner fails to accept user 2's request because the item is already accepted
    res = await request(server)
      .put(`/api/requests/${request2_id}/respond`)
      .set(owner_headers)
      .send({ response: 'accepted' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('The item is being rented by another user.');

    // owner completes user1's request
    res = await request(server)
      .put(`/api/requests/${request1_id}/respond`)
      .set(owner_headers)
      .send({ response: 'completed' });
    expect(res.status).toBe(200);

    // owner can now successfully accept user 2's request
    res = await request(server)
      .put(`/api/requests/${request2_id}/respond`)
      .set(owner_headers)
      .send({ response: 'accepted' });
    expect(res.status).toBe(200);

    // user1 cannot respond to a request for owner's item
    res = await request(server)
      .put(`/api/requests/${request2_id}/respond`)
      .set(headers)
      .send({ response: 'completed' });
    expect(res.status).toBe(403);

    // user2 cannot delete user1's request
    res = await request(server)
      .del(`/api/requests/${request1_id}`)
      .set(user2_headers)
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('You did not make this request');

    // user1 can delete their own request
    res = await request(server)
      .del(`/api/requests/${request1_id}`)
      .set(headers)
    expect(res.status).toBe(200);
  });
});
