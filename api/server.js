const express = require('express');

const postRouter = require('../posts/posts-router');

const server = express();

server.get('/', (req, res) => {
    res.send('<h2> POST API <H2>')
})

server.use('/api/posts', postRouter);

module.exports = server;