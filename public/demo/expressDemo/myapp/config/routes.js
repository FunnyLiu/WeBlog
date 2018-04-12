var express = require('express');


var indexRoute = require('../routes/index');
var usersRoute = require('../routes/users');
var imRoute = require('../routes/im');
var browserRoute = require('../routes/browser');

var app = express();

app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use('/im', imRoute);
app.use('/browser', browserRoute);


module.exports = app;