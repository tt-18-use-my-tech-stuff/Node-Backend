const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

//Import routers here
const authRouter = require('./auth/auth-router.js');
const itemsRouter = require("./items/items-router");
const accountRouter = require("./accounts/account-router.js")
const requestsRouter = require('./requests/requests-router.js')
const { accountRequired } = require("./middleware/restricted");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

//Initialize routers here
server.use('/api/auth', authRouter)
server.use("/api/items", accountRequired, itemsRouter);
server.use("/api/account", accountRequired, accountRouter)
server.use('/api/requests', accountRequired, requestsRouter)

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
