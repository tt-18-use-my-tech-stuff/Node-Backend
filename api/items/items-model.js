const db = require("../../data/dbconfig");

const get = () => {
  return db("items");
};

const getBy = (filter) => {
  return db("items").where(filter).first();
};

const getById = (item_id) => {
  return getBy({ item_id });
};

const insert = async (item) => {
  const [createdItemId] = await db("items").insert(item);
  return getById(createdItemId);
};

const update = async (item_id, item) => {
  await db("items").where({ item_id }).update(item);
  return getById(item_id);
};

const del = async (item_id) => {
  await db("items").where({ item_id }).del();
  return item_id;
};

module.exports = {
  get,
  getBy,
  getById,
  insert,
  update,
  del,
};
