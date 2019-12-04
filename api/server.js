const express = require(`express`);

const postRouter = require(`../posts/router`);

const server = express();

server.get(`/`, (req, res) => res.send(`<h2>Posts API</h2>`));

server.use(`/api/posts`, postRouter);

module.exports = server;