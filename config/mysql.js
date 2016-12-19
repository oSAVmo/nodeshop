var mysql = require('mysql2');
var log = require('./logger');

var db = require('./conf').mysql;

db.init = function() {
  this.pool = mysql.createPool(db);
  log.info('mysql pool created...');
}

module.exports = db;