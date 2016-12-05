var express = require('express');
var app = express();

var filter = require('./_filter');

var root = require('./Root');
var test = require('./TestRt');
var users = require('./UserRt');
var shopify = require('./ShopifyAccessRt');
var olOrder = require('./OnlineOrderRt');

app.use(filter);
app.use('/', root);
app.use('/test', test);
app.use('/users', users);
app.use('/shopify', shopify);
app.use('/online-order', olOrder);

module.exports = app;
