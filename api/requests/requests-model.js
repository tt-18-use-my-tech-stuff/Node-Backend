const db = require('../../data/dbconfig');



const get = () => {
    return db("requests");
};

const getBy = (filter) => {
    return db("requests").where(filter).first();
};

const getById = (request_id) => {
    return getBy({ request_id });
};

const insert = async (request) => {
    const [createRequestId] = await db('requests').insert(request);
    return getById(createRequestId)
}

const update = async (request_id, request) => {
    await db('requests').where({ request_id }).update(request)
    return getById(request_id)
}

const remove = async (request_id) => {
    await db('requests').where({ request_id }).del();
    return request_id

}


module.exports = {
    get,
    getBy,
    getById,
    insert,
    update,
    remove,

};
