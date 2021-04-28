const db = require('../../data/dbconfig.js')

function getAccount(user_id) {
    return db('users')
        .select("user_id", "username", "email")
        .where({ user_id })
        .first()
}

function getAccountItems(user_id) {
    return db("items as i")
        .select("i.item_id", "i.item_name", "i.category", "i.item_description", "i.price", "u.username as renter")
        .leftJoin("requests as r", "r.item_id", "i.item_id")
        .leftJoin("users as u", "r.renter_id", "u.user_id")
        .distinctOn("i.item_id")
        .where("i.owner_id", user_id)
}

function getAccountRequests(user_id) {
    return db("requests as r")
        .select("r.request_id", "i.item_name", "u.username as owner", "r.status")
        .leftJoin("items as i", "r.item_id", "i.item_id")
        .leftJoin("users as u", "i.owner_id", "u.user_id")
        .where("r.renter_id", user_id)
}

function getMyAccountRequests(user_id) {
    return db("requests as r")
        .select("r.request_id", "i.item_name", "u.username as requester", "r.status")
        .leftJoin("items as i", "r.item_id", "i.item_id")
        .leftJoin("users as u", "r.renter_id", "u.user_id")
        .where("i.owner_id", user_id)
}

function update(user_id, user) {
    return db("users")
        .update(user)
        .where({user_id})
}

module.exports = {
    getAccount,
    getAccountItems,
    getAccountRequests,
    getMyAccountRequests,
    update
}