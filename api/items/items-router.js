const router = require("express").Router();

const Item = require('./items-model');
const {
	validateItemPost,
	validateItemPut,
	checkItemIdExists
} = require('./items-middleware');

router.get('/', (req, res, next) => {
	res.json('got');
});

router.get('/:item_id', checkItemIdExists, (req, res, next) => {
	res.json('got by id');
});

router.post('/', validateItemPost, (req, res, next) => {
	res.json('posted');
});

router.put('/:item_id', checkItemIdExists, validateItemPut, (req, res, next) => {
	res.json('edited');
});

router.delete('/:item_id', checkItemIdExists, (req, res, next) => {
	res.json('delorted');
});

module.exports = router;
