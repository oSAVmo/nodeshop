var express = require('express');
var app = express();

var root = require('./Root');
var test = require('./TestRt');
var util = require('./UtilRt');
var user = require('./UserRt');
var shopify = require('./ShopifyAccessRt');
var olOrder = require('./OnlineOrderRt');

app.use('/', root);
app.use('/test', test);
app.use('/utilities', util);
app.use('/user', user);
app.use('/shopify', shopify);
app.use('/online-order', olOrder);

module.exports = app;
