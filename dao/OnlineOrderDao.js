var mongo = require('../common/mongo');
var log = require('../common/logger');

var onlinOrderDao = {
  module : 'dao',
  name : 'OnlinOrderDao'
};

// get all orders
onlinOrderDao.queryAll = function(next) {
  try {
    mongo.conn.collection('co_ol_orders').find().toArray(function(err, data) {

      if (err) {
        throw err;
      }

      mongo.conn.close();
      log.info(this.name + '@getAll: data retrived. ---%j---', data);
      next(0, data);
    });
  } catch (e) {
    log.error(this.name + '@getAll: %j', e);
    next(10001, e);
  }
}

// insert an order
onlinOrderDao.insert = function(data, next) {
  try {
    mongo.conn.collection('co_ol_orders').insertOne(data, function(err, data) {

      if (err) {
        throw err;
      }

      mongo.conn.close();
      log.info(this.name + '@insert: data inserted. ---%j---', data);
      next(0, data);
    });
  } catch (e) {
    log.error(this.name + 'insert: %j', e);
    next(10002, e);
  }
}

module.exports = onlinOrderDao;