const Request = require('./requests-model');
const Item = require('../items/items-model');

const checkRequestExists = (req, res, next) => {
	Request.getById(req.params.request_id).then(request => {
		if (request) {
			req.request = request;
			next();
		}
		else {
			next({ status: 404, message: `No item found with id ${req.body.id}` });
		}
	})
	.catch(next);
}

const checkRequestPost = (req, res, next) => {
  const { item_id } = req.body;
  if (!item_id) {
    next({ status: 400, message: `item_id is required.` });
    return;
  }
	Item.getById(item_id).then(item => {
		if (item) {
			next();
		}
		else {
			next({ status: 404, message: `No item found with id ${item_id}` });
		}
	})
	.catch(next);
};

const checkResponse = (req, res, next) => {
	const response = req.body.response;

	if (response === undefined) {
    next({ status: 400, message: `response is required.` });
	}
	else if (typeof response !== 'string') {
    next({ status: 400, message: `response must be of type "string".` });
	}
	else if (response === 'accepted') {
		if (req.request.status !== 'pending') {
			next({ status:400, message: "Cannot accept a request that is not pending." })
		}
		else if (req.request.renter_id !== null) {
			next({ status: 400, message: "The item is being rented by another user." });
		}
		else {
			next();
		}
	}
	else if (response === 'declined') {
		if (req.request.status !== 'pending') {
			next({ status:400, message: "Cannot decline a request that is not pending." })
		}
		else {
			next();
		}
	}
	else if (response === 'completed') {
		if (req.request.status !== 'accepted') {
			next({ status:400, message: "Cannot complete a request that is not accepted." })
		}
		else {
			next();
		}
	}
	else {
    next({ status: 400, message: `response must be "accepted", "declined", or "completed".` });
	}
}

const attachRenterId = (req, res, next) => {
	const renter_id = req.decodedToken.subject;
	req.body.renter_id = renter_id;
	next();
}

module.exports = {
	checkRequestExists,
  checkRequestPost,
	checkResponse,
	attachRenterId
};
