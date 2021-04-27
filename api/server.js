const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

//Import routers here
const authRouter = require('./auth/auth-router.js')
const itemsRouter = require("./items/items-router");

const { accountRequired } = require("./middleware/restricted");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

//Initialize routers here
server.use('/api/auth', authRouter)
server.use("/api/items", accountRequired, itemsRouter);

// two underscores gives argument name clash
server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
