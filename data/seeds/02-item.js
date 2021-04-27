
exports.seed = async knex => {
  await knex('items').truncate();
  return knex('items').insert([
    { item_id: 1, item_name: 'Standing Desk', item_description: "It stands! it's a desk!", owner_id: 1 },
    { item_id: 2, item_name: 'Headphones', item_description: "Guaranteed 88% germ-free!", owner_id: 1 },
    { item_id: 3, item_name: 'A Real Keyboard', item_description: "Made of cardboard. Not a real keyboard", owner_id: 1 },
  ]);
}
