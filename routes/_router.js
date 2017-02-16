const express = require('express');
const app = express();

const root = require('./Root');
const test = require('./TestRt');
const util = require('./UtilRt');
const user = require('./UserRt');
const shopify = require('./ShopifyAccessRt');
const olOrder = require('./OnlineOrderRt');
const erply = require('./ErplyAccessRt');

app.use('/', root);
app.use('/test', test);
app.use('/utilities', util);
app.use('/user', user);
app.use('/erply', erply);
app.use('/shopify', shopify);
app.use('/online-order', olOrder);

module.exports = app;
