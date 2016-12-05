var mongodb = require('mongodb');
var client = require('mongodb').MongoClient;
var log = require('./logger');
var db = {
  prefix : 'mongodb://',
  url : '127.0.0.1',
  port : '27017',
  database : 'osavmo'
};

db.init = function() {
  try {
    // Initialize connection once
    client.connect(getConnStr(db), function(err, database) {
      if (err) {
        throw err;
      }
      
      db.conn = database;
      log.info('MongoDB initialized...');
    });
  } catch(e) {
    log.error(e)
  }
}

function getConnStr(dba) {

  return dba.prefix + dba.url + ':' + dba.port + '/' + dba.database;
}

module.exports = db;