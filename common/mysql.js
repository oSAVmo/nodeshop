/** MySQL database connection pool */
const mysql = require('mysql2');
const log = require('./logger');

const conf = require('../config/conf').mysql;

let db = {};
db.init = function() {
  db.pool = mysql.createPool(conf);
  log.info('mysql pool created...');
}

module.exports = db;
