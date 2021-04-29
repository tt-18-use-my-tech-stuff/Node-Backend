const db = require('../../data/dbconfig');

const get = () => {
	return db('requests as r')
		.leftJoin('items as i', 'r.item_id', 'i.item_id')
		.select([
			'request_id',
			'i.item_id',
			'owner_id',
			'renter_id',
			'status',
			'item_name',
			'item_description',
			'price',
			'category',
		]);
};

const getBy = (filter) => {
	return db('requests as r')
		.where(filter)
		.leftJoin('items as i', 'r.item_id', 'i.item_id')
		.select([
			'request_id',
			'i.item_id',
			'owner_id',
			'renter_id',
			'status',
			'item_name',
			'item_description',
			'price',
			'category',
		])
		.first();
};

const getById = (request_id) => {
	return getBy({ request_id: request_id });
};

const insert = async (request) => {
	let idArr;
	process.env.NODE_ENV !== 'production'
		? (idArr = await db('requests').insert(request))
		: (idArr = await db('requests').insert(request).returning('request_id'));
	return getById(idArr[0]);
	// if (process.env.NODE_ENV !== 'production') {
	//   const [id] = await db('requests').insert(request);
	//   return getById(id);
	// } else {
	//   const [newRequestID] = await db('requests')
	//     .insert(request)
	//     .returning('request_id');
	//   return getById(newRequestID);
	// }
};

const update = async (request_id, request) => {
	if (process.env.NODE_ENV !== 'production') {
		const id = await db('requests').where({ request_id }).update(request);
		return getById(id);
	} else {
		const newRequests = await db('requests')
			.where({ request_id })
			.update(request)
			.returning([
				'request_id',
				'item_id',
				'owner_id',
				'renter_id',
				'status',
				'item_name',
				'item_description',
				'price',
				'category',
			]);
		return newRequests[0];
	}
};

const remove = async (request_id) => {
	await db('requests').where({ request_id }).del();
	return request_id;
};

module.exports = {
	get,
	getBy,
	getById,
	insert,
	update,
	remove,
};
