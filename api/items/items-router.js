const router = require("express").Router();

const Item = require('./items-model');

router.get('/', (req, res, next) => {
	res.json('got');
});

router.get('/:item_id', (req, res, next) => {
	res.json('got by id');
});

router.post('/', (req, res, next) => {
	res.json('posted');
});

router.put('/:item_id', (req, res, next) => {
	res.json('edited');
});
