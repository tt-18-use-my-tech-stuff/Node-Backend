const router = require("express").Router();
const Request = require('./requests-model')

const mw = require('./requests-middleware.js')

router.post('/', mw.checkRequestPost, (req, res, next) => {
    const request = req.body;
    Request.insert(request)
        .then(newRequest => {
            res.status(201).json(newRequest)
        })
        .catch(next)
})

router.get("/:request_id", (req, res) => {
    const request_id = req.params.request_id
    Request.getById(request_id)
        .then((request) => {
            res.status(200).json(request);
        })
});


router.put('/:request_id', (req, res, next) => {

    Request.update(req.params.request_id, req.body)
        .then((updatedRequest) => {
            res.status(200).json(updatedRequest)
        })
        .catch(next)

})

router.delete('/:request_id', (req, res, next) => {
    Request.remove(req.params.request_id)
        .then(deletedRequestId => {
            res.status(200).json(deletedRequestId)
        })
        .catch(next)
})


module.exports = router;