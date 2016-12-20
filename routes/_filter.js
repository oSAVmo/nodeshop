var express = require('express');
var log = require('../config/logger');
var app = express();

const exeptions = [ '/user/login', '/shopify', '/general', '/utilities/mail'];

app.all('/shopify/*', function(req, res, next) {
  log.info('ACCESS TO SHOPIFY');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.all('*', function(req, res, next) {
  //  console.log('this is a console out');
  log.info('REQUEST LOG: requesting %j|%j from %j|%j', req.url, req.path, req.headers.host, req.headers.orgin);
  var loginFilter = false;
  if (matchException(req.path)) {
    log.info('Bypass login....');
    loginFilter = true;
  } else {
    if (req.session && req.session.user) {
      loginFilter = true;
    } else {
      loginFilter = false;
    }    
  }
  
  if(loginFilter) {
    next();
  } else {
    res.json({
      error : 1,
      data : {},
      message : 'User not logged in.'
    });
  }
});

function matchException(path) {
  for (var i = 0; i < exeptions.length; i++) {
    var str = exeptions[i];
    log.info(str);
    if (path.startsWith(str)) {
      return true;
    }
  }
  return false;
}

module.exports = app;