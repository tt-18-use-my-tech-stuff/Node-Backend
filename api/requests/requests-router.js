const router = require('express').Router();
const Request = require('./requests-model');

const {
  checkRequestExists,
  checkRequestPost,
  checkResponse,
  attachRequesterId
} = require('./requests-middleware.js');

router.get('/', (req, res) => {
  // really just here for testing
  Request.get().then((requests) => res.status(200).json(requests));
});

router.get('/:request_id', checkRequestExists, (req, res) => {
  console.log('request router', req.params)
  res.status(200).json(req.request);
});

router.post('/', checkRequestPost, attachRequesterId, (req, res, next) => {
  const request = req.body;
  Request.insert({...request, status: 'pending'})
    .then((newRequest) => {
      res.status(201).json(newRequest);
    })
    .catch(next);
});

router.put(
  '/:request_id/respond',
  checkRequestExists,
  checkResponse,
  (req, res, next) => {
    Request.update(req.params.request_id, { status: req.body.response })
      .then((updatedRequest) => {
        res.status(200).json(updatedRequest);
      })
      .catch(next);
  }
);

router.delete('/:request_id', (req, res, next) => {
  Request.remove(req.params.request_id)
    .then((deletedRequestId) => {
      res.status(200).json(deletedRequestId);
    })
    .catch(next);
});

module.exports = router;
