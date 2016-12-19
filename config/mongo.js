var mongodb = require('mongodb');
var client = require('mongodb').MongoClient;
var log = require('./logger');
var db = require('./conf').mongodb;

db.init = function(next) {
  try {
    // Initialize connection once
    client.connect(getConnStr(db), function(err, database) {
      if (err) {
        throw err;
      }
      
      db.conn = database;
      log.info('MongoDB initialized...');
      next();
    });
  } catch(e) {
    log.error(e)
  }
}

function getConnStr(dba) {

  return dba.prefix + dba.url + ':' + dba.port + '/' + dba.database;
}

module.exports = db;