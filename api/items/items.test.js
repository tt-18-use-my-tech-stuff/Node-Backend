const request = require('supertest');

const server = require('../server.js');
const db = require('../../data/dbconfig');

const headers = {};

const user = { username: 'user', password: 'test' };
const item1 = {
  item_name: 'Television',
  item_description: 'New TV! It works great!',
  price: 0.555,
  category: 'Displays',
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

describe('POST /api/items/', () => {
  const path = '/api/items';

  it('rejects unauthorized requests', async () => {
    let res = await request(server).post(path).send(item1);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token required');
  });

  it('rejects incorrect requests', async () => {
    let res;

    res = await request(server).post(path).set(headers).send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('item_name required.');

    res = await request(server)
      .post(path)
      .set(headers)
      .send({ item_name: 'asdfasdf' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('item_description required.');

    res = await request(server).post(path).set(headers).send({
      item_name: 'asdfasdf',
      item_description: 'asdfasdf',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('price required.');

    res = await request(server)
      .post(path)
      .set(headers)
      .send({
        ...item1,
        extraField: 'asdf',
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('extraField is not a valid field.');
  });

  it('accepts properly formatted item', async () => {
    let res = await request(server).post(path).set(headers).send(item1);
    expect(res.status).toBe(201);
  });
});

describe('PUT /api/items/', () => {
  it('can edit items', async () => {
    let res;
    res = await request(server).post('/api/items').set(headers).send(item1);
    const item_id = res.body.item_id;
    res = await request(server)
      .put(`/api/items/${item_id}`)
      .set(headers)
      .send({ item_description: 'nvm, not new anymore' });
    console.log(res.status, res.body.message);
    expect(res.status).toBe(200);
    res = await request(server).get(`/api/items/${item_id}`).set(headers);
    expect(res.body.item_description).toBe('nvm, not new anymore');
  });
});

describe('DELETE /api/items/', () => {
  it('can delete items', async () => {
    let res;
    res = await request(server).post('/api/items').set(headers).send(item1);
    const item_id = res.body.item_id;
    res = await request(server).del(`/api/items/${item_id}`).set(headers);
    expect(res.status).toBe(200);
    res = await request(server).get(`/api/items/${item_id}`).set(headers);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe(`No item found with id ${item_id}.`);
  });
  it('deleted the item', async () => {
    let res;
    res = await request(server).get('/api/items').set(headers);
    const originalItems = res.body;
    await request(server)
      .del(`/api/items/${originalItems[0].item_id}`)
      .set(headers);
    res = await request(server).get('/api/items').set(headers);
    expect(res.body.length).toBe(originalItems.length - 1);
    originalItems.shift();
    for (let i = 0; i < originalItems.length; i++) {
      expect(originalItems[i]).toEqual(res.body[i]);
    }
  });
});
