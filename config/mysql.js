var mysql = require('mysql2');
var log = require('./logger');

var db = {
  'driver' : 'mysql',
  'host' : 'localhost',
  'port' : '3306',
  'database' : 'osavmo',
  'user' : 'osavmoadmin',
  'password' : 'zxPHDrKXEm29GQc5'
};

db.init = function() {
  mysql.createPool(this);
  log.info('mysql pool created');
}

db.conn = function() {
  return pool.getConnection();
}

module.exports = db;