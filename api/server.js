const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

//Import routers here
const itemsRouter = require("./items/items-router");

const restricted = require("./middleware/restricted");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

//Initialize routers here
server.use("/api/items", restricted, itemsRouter);

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
