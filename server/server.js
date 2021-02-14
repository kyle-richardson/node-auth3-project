const express = require('express');
const UserRouter = require('../routers/user-router')
const configureMiddleware = require('./configure-middleware.js');
const restricted = require('../auth/restricted')

const server = express();
configureMiddleware(server);
server.use('/api', UserRouter)
server.use('/api/restricted', restricted)

server.get('/', (res,req) => {
    res.send('API working')
})


module.exports = server;