
const db = require("../../data/dbconfig");

const find = () => {
	return db('items');
};

const findBy = (filter) => {
	return db('items').where(filter).first();
}

const findById = (item_id) => {
	return findBy({ item_id });
};

const add = async (item) => {
	const [ createdItemId ] = await db("items").insert(item);
	return findById(createdItemId);
};

const editById = async (item_id, item) => {
	const [ editedItemId ] = await db("items").where({ item_id }).update(item);
	return findById(editedItemId);
};

const deleteById = async (item_id) => {
	const [ deletedItemId ] = await db("items").where({ item_id }).del();
	return deletedItemId;
};

module.exports = {
	find,
	findById,
	add,
	editById,
	deleteById
};
