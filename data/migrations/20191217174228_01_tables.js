exports.up = function (knex) {
    return knex.schema
        .createTable('users', tbl => {
            tbl.increments('user_id')
            tbl.string('username', 128)
                .notNullable()
            tbl.string('password')
                .notNullable()
            tbl.string('email', '256')
        })
        .createTable('items', tbl => {
            tbl.increments('item_id')
            tbl.string('item_name', 256)
                .notNullable()
            tbl.text('item_description')
                .notNullable()
            tbl.decimal('price', 2)
                .notNullable()
            tbl.string('category', 256)
                .notNullable()
            tbl.integer('owner_id')
                .unsigned()
                .references('users.user_id')
                .notNullable()
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
        })
        .createTable('requests', tbl => {
            tbl.increments('request_id')
            tbl.integer('renter_id')
                .unsigned()
                .references('users.user_id')
                .notNullable()
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
            tbl.integer('item_id')
                .unsigned()
                .references('items.item_id')
                .notNullable()
                .onDelete('CASCADE')
                .onUpdate('CASCADE')
            tbl.string('status', 9)
        })
}

exports.down = knex => {
    return knex.schema
        .dropTableIfExists('requests')
        .dropTableIfExists('items')
        .dropTableIfExists('users')
}
