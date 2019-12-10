const express = require('express');

const db = require('./data/dbConfig.js');

const AccountsRouter = require('./Accounts/accounts-router');

const server = express();

server.use(express.json());

server.use('/api/accounts', AccountsRouter)

server.use('/', (req,res)=> {
    res.send('Hello')
})

module.exports = server;