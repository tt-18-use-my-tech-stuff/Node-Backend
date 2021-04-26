const router = require("express").Router();

const Item = require('./items-model');
const {
	validateItemPost,
	validateItemPut,
	attachOwnerId,
	checkItemIdExists
} = require('./items-middleware');

router.get('/', (req, res, next) => {
	Item.find()
		.then(items => {
			res.status(200).json(items);
		})
		.catch(next);
});

router.get('/:item_id', checkItemIdExists, (req, res, next) => {
	res.json('got by id');
});

router.post('/', validateItemPost, attachOwnerId, (req, res, next) => {
	const item = req.body;
	Item.add(item)
		.then(createdItem => {
			res.status(201).json(createdItem);
		})
		.catch(next)
});

router.put('/:item_id', checkItemIdExists, validateItemPut, (req, res, next) => {
	res.json('edited');
});

router.delete('/:item_id', checkItemIdExists, (req, res, next) => {
	res.json('delorted');
});

module.exports = router;
