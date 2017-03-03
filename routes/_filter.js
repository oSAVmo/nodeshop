/** router filter */
var express = require('express');
var log = require('../common/logger');
var app = express();

// TODO: temperary solution, authorization to be done.
// modules that do not require login
const exeptions = ['/user/login', '/shopify', '/general', '/utilities/mail'];

/* enable CROS */
app.all('*', function (req, res, next) {
  log.info('grant CROSS DOMAIN...');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

/* login filter */
app.all('*', function (req, res, next) {
  //  console.log('this is a console out');
  log.info('REQUEST LOG: requesting %j|%j from %j|%j', req.url, req.path,
    req.headers.host, req.headers.orgin);
  var loginFilter = false;
  // in exeption
  if (matchException(req.path)) {
    log.info('Bypass login....');
    loginFilter = true;
  } else {
    // check session
    if (req.session && req.session.user) {
      loginFilter = true;
    } else {
      loginFilter = false;
    }
  }

  if (loginFilter) {
    next();
  } else {
    // TODO: set res status 401
    res.json({
      error: 1,
      data: {},
      message: 'User not logged in.'
    });
  }
});

/* match path exceptions */
function matchException(path) {
  for (let i = 0; i < exeptions.length; i++) {
    let str = exeptions[i];
    if (path.startsWith(str)) {
      return true;
    }
  }
  return false;
}

module.exports = app;