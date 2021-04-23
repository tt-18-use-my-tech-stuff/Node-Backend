exports.up = function (knex) {
    return knex.schema
        .createTable('users', tbl => {
            tbl.increments('role_id')
            tbl.text("username", 128)
                .notNullable()
        });
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('users')
}
