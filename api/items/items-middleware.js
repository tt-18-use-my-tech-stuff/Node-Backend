const Item = require('./items-model');

const validFields = {
  item_name: { type: 'string', required: true },
  item_description: { type: 'string', required: true },
  price: { type: 'number', required: true },
  category: { type: 'string', required: true },
};

const validateItemPost = (req, res, next) => {
  // check for required fields.
  const item = req.body;
  const keys = Object.keys(validFields);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (validFields[key].required) {
      if (item[key] === undefined || item[key] === '') {
        next({ status: 400, message: `${key} required.` });
        return;
      }
    }
  }

  validateItemPut(req, res, next);
};

const validateItemPut = (req, res, next) => {
  // check for invalid fields.
  const item = req.body;
  const keys = Object.keys(item);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (!validFields[key]) {
      next({ status: 400, message: `${key} is not a valid field.` });
      return;
    }

    if (typeof item[key] !== validFields[key].type) {
      next({
        status: 400,
        message: `${key} must be of type "${validFields[key].type}".`,
      });
      return;
    }
  }

  next();
};

const attachOwnerId = (req, res, next) => {
  // find owner id from token and attach it to body
  req.body.owner_id = req.decodedToken.subject;
  next();
};

const checkItemIdExists = (req, res, next) => {
  const item_id = req.params.item_id;

  Item.getById(item_id)
    .then((item) => {
      if (item) {
        req.item = item;
        next();
      } else {
        next({ status: 404, message: `No item found with id ${item_id}.` });
      }
    })
    .catch(err => {
      console.log('checkItemIdExists middleware')
      next(err)
    });
};

const checkItemIsMine = (req, res, next) => {
  const item_id = req.params.item_id;
  const myId = req.decodedToken.subject;

  Item.getById(item_id)
    .then((item) => {
      if (item.owner_id === myId) {
        next();
      } else {
        next({ status: 403, message: 'You are not the owner of this item.' });
      }
    })
    .catch(err => {
      console.log('checkItemIsMine middleware')
      next(err)
    });
};

module.exports = {
  validateItemPost,
  validateItemPut,
  attachOwnerId,
  checkItemIdExists,
  checkItemIsMine,
};
