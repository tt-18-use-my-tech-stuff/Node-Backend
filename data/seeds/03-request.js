exports.seed = async knex => {
    await knex('requests').del();
    return knex('requests').insert([
      { renter_id: 3, item_id: 1, status: 'declined' },
      { renter_id: 2, item_id: 1, status: 'accepted' },
      { renter_id: 3, item_id: 2, status: 'pending' },
      { renter_id: 3, item_id: 3, status: 'accepted' }
    ]);
  }
  