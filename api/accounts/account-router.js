const router = require('express').Router();
const {accountRequired} = require("../middleware/restricted.js");
const Accounts = require("./account-model.js");
const {checkParamsExist} = require("./account-mw.js")

router.get("/", accountRequired, (req,res,next)=>{
    const id = req.decodedToken.subject;
    Accounts.getAccount(id)
    .then(account=>{
        res.status(200).json(account);
    })
    .catch(next)
})

router.put("/", accountRequired, checkParamsExist, (req,res,next)=>{
    const id = req.decodedToken.subject;
    Accounts.update(id, req.body)
    .then(account=>{
        res.status(200).json(account);
    })
    .catch(next)
})

router.get("/items", accountRequired, (req,res,next)=>{
    const id = req.decodedToken.subject;
    Accounts.getAccountItems(id)
    .then(items=>{
        items.length > 0
        ? res.status(200).json(items)
        : res.status(200).json("You have no items");
    })
    .catch(next)
})

router.get("/requests", accountRequired, (req,res,next)=>{
    const id = req.decodedToken.subject;
    Accounts.getAccountRequests(id)
    .then(requests=>{
        requests.length > 0
        ? res.status(200).json(requests)
        : res.status(200).json("You have made no requests");
    })
    .catch(next)
})

router.get("/requests/owned", accountRequired, (req,res,next)=>{
    const id = req.decodedToken.subject;
    Accounts.getMyAccountRequests(id)
    .then(requests=>{
        requests.length > 0
        ? res.status(200).json(requests)
        : res.status(200).json("You have no requests");
    })
    .catch(next)
})

module.exports = router;