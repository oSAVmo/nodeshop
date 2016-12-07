var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log = require('winston');
var jsons = require('JSON2');
var mongo = require('./config/mongo');
var mysql = require('./config/mysql');

var app = express();

mongo.init();
mysql.init();

var routerConfig = require('./routes/_router');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routerConfig);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);
  res.json({error: true, message: 'RESOUCE NOT FOUND'});
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log('Uncaught Exception, check exception log. $j', err);
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


module.exports = app;
