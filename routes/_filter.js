var express = require('express');
var log = require('../config/logger');
var app = express();

app.all('*', function(req, res, next) {
//  console.log('this is a console out');
//  log.info('this is a winston log.');
  next();
})

app.all('/shopify', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

module.exports = app;