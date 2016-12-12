var mysql = require('mysql2');
var log = require('./logger');

var db = require('./conf').mysql;

db.init = function() {
  mysql.createPool(this);
  log.info('mysql pool created');
}

db.conn = function() {
  return pool.getConnection();
}

module.exports = db;