const db = require('../../data/dbconfig');

const getAcceptedRequests = async (field) =>
  db('requests').where({ status: 'accepted' }).pluck(field);

const get = async () => {
  const acceptedRequestIds = await getAcceptedRequests('request_id');

  return db('items as i')
    .leftJoin('requests as req', function () {
      this.on('i.item_id', 'req.item_id').onIn(
        'req.request_id',
        acceptedRequestIds
      );
    })
    .leftJoin('users as own', 'i.owner_id', 'own.user_id')
    .leftJoin('users as ren', 'req.renter_id', 'ren.user_id')
    .select(
      'i.item_id',
      'item_name',
      'item_description',
      'price',
      'category',
      'owner_id',
      'renter_id',
      'own.username as owner',
      'ren.username as renter'
    );
};

const getAvailable = async () => {
  const acceptedItemIds = await getAcceptedRequests('item_id');

  return db('items as i')
    .whereNotIn('i.item_id', acceptedItemIds)
    .leftJoin('users as o', 'i.owner_id', 'o.user_id')
    .select(
      'item_id',
      'item_name',
      'item_description',
      'price',
      'category',
      'owner_id',
      'o.username as owner'
    );
};

const getBy = async (filter) => {
  const acceptedRequestIds = await getAcceptedRequests('request_id');

  return db('items as i')
    .where(filter)
    .leftJoin('requests as r', function () {
      this.on('i.item_id', 'r.item_id').onIn(
        'r.request_id',
        acceptedRequestIds
      );
    })
    .select(
      'i.item_id',
      'item_name',
      'item_description',
      'price',
      'category',
      'owner_id',
      'renter_id'
    )
    .first();
};

const getById = (item_id) => getBy({ 'i.item_id': item_id });

const insert = async (item) => {
  if (process.env.NODE_ENV !== 'production') {
    const [id] = await db('items').insert(item);
    return getById(id);
  } else {
    const newItems = await db('items')
      .insert(item)
      .returning([
        'item_id',
        'item_name',
        'item_description',
        'price',
        'category',
        'owner_id',
      ]);
    return newItems[0];
  }
};

const update = async (item_id, item) => {
  if (process.env.NODE_ENV !== 'production') {
    await db('items').where({ item_id }).update(item);
    return getById(item_id);
  } else {
    const updatedItems = await db('items')
      .where({ item_id })
      .update(item)
      .returning([
        'item_id',
        'item_name',
        'item_description',
        'price',
        'category',
        'owner_id',
      ]);
    return updatedItems[0];
  }
};

const del = async (item_id) => {
  await db('items').where({ item_id }).del();
  return item_id;
};

module.exports = {
  get,
  getAvailable,
  getBy,
  getById,
  insert,
  update,
  del,
};
