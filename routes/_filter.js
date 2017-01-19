var express = require('express');
var log = require('../common/logger');
var app = express();

const exeptions = [ '/user/login', '/shopify', '/general', '/utilities/mail'];

app.all('*', function(req, res, next) {
  log.info('grant CROSS DOMAIN...');
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
    } else {
      log.info()
    }
  }
  return false;
}

module.exports = app;