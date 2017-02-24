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

});

module.exports = app;
