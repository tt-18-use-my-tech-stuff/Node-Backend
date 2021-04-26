
const Item = require('./items-model');

const validItemFields = {
	name: { type: "string" },
	description: { type: "string" }
};

const validateItemPost = (req, res, next) => {
	const item = req.body;
	const keys = Object.keys(item);

	// check required fields
	if (!item.name) {
		next({ status: 400, message: `name is required.` });
		return;
	}
	if (!item.description) {
		next({ status: 400, message: `description is required.` });
		return;
	}

	validateItemPut(req, res, next);
}

const validateItemPut = (req, res, next) => {
	// check body for invalid fields
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];

		if (!validItemFields[key]) {
			next({ status: 400, message: `${key} is not a valid field.` });
			return;
		}

		if (typeof item[key] !== validItemFields[key].type) {
			next({
				status: 400,
				message: `${key} must be of type "${validItemFields[key].type}".`});
			return;
		}
	}

	next();
}

const checkItemIdExists = (req, res, next) => {
	const item_id = req.params.item_id

	Item.getById(item_id)
		.then(item => {
			if (item) {
				req.item = item;
				next();
			}
			else {
				next({ status: 404, message: `No item found with id ${item_id}.` });
			}
		})
		.err(next);
}

module.exports = {
	validateItemPost,
	validateItemPut,
	checkItemIdExists
}