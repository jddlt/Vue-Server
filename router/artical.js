const express = require('express');
const app = express()
const postParams = require('./util/postParams')
const { mySend, myError } = require('./util/send')

app.get('/sendArtical', async (req, res) => {
    const params = req.query;
    mySend(res, { data: 'hcsahci'} )
})