
exports.seed = async knex => {
  await knex('items').del();
  return knex('items').insert([
    { item_name: 'Standing Desk', item_description: "It stands! it's a desk!", owner_id: 1, price: 12.50, category: 'Office' },
    { item_name: 'Headphones', item_description: "Guaranteed 88% germ-free!", owner_id: 1, price: 7.50, category: 'Audio' },
    { item_name: 'A Real Keyboard', item_description: "Made of cardboard. Not a real keyboard", owner_id: 2, price: 8.00, category: 'Office' },
    { item_name: 'Monitor', item_description: "Very small", owner_id: 1, price: 10.99, category: 'Displays' },
  ]);
}
