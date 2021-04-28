const db = require('../../data/dbconfig');

const getAcceptedRequests = async (field) =>
  db('requests').where({ status: 'accepted' }).pluck(field);

const get = async () => {
  const acceptedRequestIds = getAcceptedRequests('request_id');

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
  const acceptedItemIds = getAcceptedRequests('item_id');

  return db('items as i')
    .whereNotIn('i.item_id', acceptedItemIds)
    .leftJoin('users as own', 'i.owner_id', 'o.user_id')
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
  const acceptedRequestIds = getAcceptedRequests('request_id');

  // This freaks out if you only put item_id because its ambiguous
  if (filter.item_id !== undefined) {
    filter['i.item_id'] = filter.item_id;
    delete filter.item_id;
  }

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

const getById = (item_id) => getBy({ item_id });

const insert = async (item) => {
  const result = await db('items').insert(item);
  const id = Array.isArray(result) ? result[0] : result;
  return getById(id);
  // return db('items')
  //   .insert(item)
  //   .returning([
  //     'i.item_id',
  //     'item_name',
  //     'item_description',
  //     'price',
  //     'category',
  //     'owner_id',
  //   ]);
};

const update = async (item_id, item) => {
  await db('items').where({ item_id }).update(item);
  return getById(item_id);
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
