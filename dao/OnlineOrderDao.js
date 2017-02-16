/** data access for online orders */
const mongo = require('../common/mongo');
const log = require('../common/logger');

/* Dao Info */
let onlineOrderDao = {
  module: 'dao',
  name: 'OnlineOrderDao'
};

/* get all orders from mongoDB */
onlineOrderDao.queryAll = function(next) {
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
    next(e, null);
  }
}

/* insert an order into mongoDB */
onlineOrderDao.insert = function(data, next) {
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
    next(e, null);
  }
}

module.exports = onlineOrderDao;
