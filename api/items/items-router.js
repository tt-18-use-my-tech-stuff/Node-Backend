const router = require('express').Router();

const Item = require('./items-model');
const {
  validateItemPost,
  validateItemPut,
  attachOwnerId,
  checkItemIdExists,
  checkItemIsMine,
} = require('./items-middleware');

router.get('/', (req, res, next) => {
  Item.get()
    .then((items) => {
      res.status(200).json(items);
    })
    .catch(next);
});

router.get('/available', (req, res, next) => {
  Item.getAvailable()
    .then((items) => {
      res.status(200).json(items);
    })
    .catch(next);
});

router.get('/:item_id', checkItemIdExists, (req, res) => {
  res.status(200).json(req.item);
});

router.post('/', validateItemPost, attachOwnerId, (req, res, next) => {
  const item = req.body;
  Item.insert(item)
    .then((createdItem) => {
      res.status(201).json(createdItem);
    })
    .catch(next);
});

router.put(
  '/:item_id',
  checkItemIdExists,
  validateItemPut,
  checkItemIsMine,
  (req, res, next) => {
    Item.update(req.params.item_id, req.body)
      .then((updatedItem) => {
        res.status(200).json(updatedItem);
      })
      .catch(next);
  }
);

router.delete(
  '/:item_id',
  checkItemIdExists,
  checkItemIsMine,
  (req, res, next) => {
    Item.del(req.params.item_id)
      .then((deletedItemId) => {
        res.status(200).json(deletedItemId);
      })
      .catch(next);
  }
);

module.exports = router;
