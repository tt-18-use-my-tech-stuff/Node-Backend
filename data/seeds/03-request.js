exports.seed = async knex => {
    await knex('requests').del();
    return knex('requests').insert([
      {renter_id: '1', item_id: 1 },
    ]);
  }
  