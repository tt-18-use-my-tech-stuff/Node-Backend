const Request = require('./requests-model')

const checkRequestPost = (req, res, next) => {
    const request = req.body
    if (!request.renter_id || !request.item_id) {
        next({ status: 400, message: `renter_id and item_id are required` })
        return
    }

}


module.exports = {
    checkRequestPost,

}