
const Item = require('./items-model');

const validItemTypes = {
	item_name: "string",
	item_description: "string"
};

const validateItemPost = (req, res, next) => {
	const item = req.body;

	// check required fields
	if (!item.item_name || !item.item_description) {
		next({ status: 400, message: `item_name and item_description required.` });
		return;
	}

	validateItemPut(req, res, next);
}

const validateItemPut = (req, res, next) => {
	const item = req.body;
	const keys = Object.keys(item);

	// check body for invalid fields
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];

		if (!validItemTypes[key]) {
			next({ status: 400, message: `${key} is not a valid field.` });
			return;
		}

		if (typeof item[key] !== validItemTypes[key]) {
			next({
				status: 400,
				message: `${key} must be of type "${validItemTypes[key]}".`});
			return;
		}
	}

	next();
}

const attachOwnerId = (req, res, next) => {
	// find owner id from token and attach it to body
	req.body.owner_id = req.decodedToken.subject;
	next();
}

const checkItemIdExists = (req, res, next) => {
	const item_id = req.params.item_id;

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
		.catch(next);
}

const checkItemIsMine = (req, res, next) => {
	const item_id = req.params.item_id;
	const myId = req.decodedToken.subject;

	Item.getById(item_id)
		.then(item => {
			if (item.owner_id === myId) {
				next();
			}
			else {
				next({ status: 403, message: "You are not the owner of this item." });
			}
		})
		.catch(next);
}

module.exports = {
	validateItemPost,
	validateItemPut,
	attachOwnerId,
	checkItemIdExists,
	checkItemIsMine
}
