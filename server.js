

// const constants =  require('./_helpers/constants');
// console.log("constants:",constants)
// global.CONSTANTS = constants;
// console.log("CONSTANTS:",CONSTANTS)
require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');
const ip = require('ip');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next) {    
    req.connectedIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if(req.connectedIP == "::1" || req.connectedIP == "127.0.0.1")
    {
        req.connectedIP = ip.address();

    }
    next();
})

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
