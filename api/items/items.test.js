const request = require('supertest')

const server = require('../server.js')
const db = require('../../data/dbconfig')

const headers = {};

const user = { username: 'user', password: 'test' };
const item1 = { item_name: 'Television', item_description: "New TV! It works great!" };
const item2 = { item_name: 'Bluetooth Speaker', item_description: "A little wear, but still works great" };

beforeAll( async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
	let res = await request(server).post('/api/auth/register').send(user);
	headers.Authorization = res.body.token;
})
beforeEach( async () => {
  await db.seed.run()
})

describe('POST /api/items/', () => {
	const path = '/api/items';

	it('rejects unauthorized requests', async () => {
		let res = await request(server).post(path).send(item1);
		expect(res.status).toBe(401);
		expect(res.body.message).toBe('Token required')
	})

	it('rejects incorrect requests', async () => {
		let res;
		res = await request(server).post(path).set(headers).send({});
		expect(res.status).toBe(400);
		expect(res.body.message).toBe('item_name and item_description required.')
		res = await request(server).post(path).set(headers).send({ item_name: 'asdfasdf' });
		expect(res.status).toBe(400);
		expect(res.body.message).toBe('item_name and item_description required.')
		res = await request(server).post(path).set(headers).send({ item_description: 'asdfasdf' });
		expect(res.status).toBe(400);
		expect(res.body.message).toBe('item_name and item_description required.')
		res = await request(server).post(path).set(headers).send({ item_name: 'asdfasdf', item_description: 'asdfasdf', extraField: 'asdfasdf' });
		expect(res.status).toBe(400);
		expect(res.body.message).toBe('extraField is not a valid field.')
	})

	it('accepts properly formatted item', async () => {
		let res = await request(server).post(path).set(headers).send(item1);
		expect(res.status).toBe(201);
	})
})

describe('PUT /api/items/', () => {
	it ('can edit items', async () => {
		let res;
		res = await request(server).post('/api/items').set(headers).send(item1);
		const item_id = res.body.item_id;
		res = await request(server).put(`/api/items/${item_id}`).set(headers).send({ item_description: "nvm, not new anymore" });
		expect(res.status).toBe(200);
		res = await request(server).get(`/api/items/${item_id}`).set(headers);
		expect(res.body.item_description).toBe("nvm, not new anymore");
	});
});

describe('DELETE /api/items/', () => {
	it ('can delete items', async () => {
		let res;
		res = await request(server).post('/api/items').set(headers).send(item1);
		const item_id = res.body.item_id;
		res = await request(server).del(`/api/items/${item_id}`).set(headers).send({ item_description: "nvm, not new anymore" });
		expect(res.status).toBe(200);
		res = await request(server).get(`/api/items/${item_id}`).set(headers);
		console.log(res.status, res.body.message);
		expect(res.status).toBe(404);
		expect(res.body.message).toBe(`No item found with id ${item_id}`);
	});
});
