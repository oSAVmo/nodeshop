var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var jsons = require('JSON2');

var log = require('./common/logger');
var mongo = require('./common/mongo');
var mysql = require('./common/mysql');
var conf = require('./config/conf');
// var mongoDBInit = require('./common/MongoInit');

var app = express();

//favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

// initialize mongoDB
mongo.init(function() {

  // init session
  app.use(session({
    secret: conf.session.secret,
    saveUninitialized: conf.session.saveUninitialized,
    resave: conf.session.resave,
    store: new MongoStore({
      db: mongo.conn,
      ttl: conf.session.ttl,
      collection: conf.session.collection
    })
  }));
  log.info('session initialized...');

  // init system data
  // mongoDBInit.init();

  // init MySQL
  mysql.init();

  // NOTE: router config, filter, and error handler must run after session initialization
  let routerConfig = require('./routes/_router');
  let routerFilter = require('./routes/_filter');
  log.info('initialize router and filter...');
  app.use(routerFilter);
  app.use(routerConfig);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    res.status(404);
    res.json({
      error: true,
      message: 'RESOURCE NOT FOUND'
    });
  });

  // error handlers
  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      log.error('Uncaught Exception, check exception log.', err);
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  });
});

module.exports = app;
