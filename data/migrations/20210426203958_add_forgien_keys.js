
exports.up = knex => {
  return knex.schema.table('items', tbl => {
    tbl.integer('request_id')
      .unsigned()
      .references('request.request_id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
  })
}

exports.down = knex => {
  return knex.schema.table('items', tbl => {
    tbl.dropColumn('request_id')
  })
}
