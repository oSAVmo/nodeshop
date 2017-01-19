
var log = require('../common/logger');
var onlineOrderDao = require('../dao/OnlineOrderDao');

var onlineOrderCtrl = {module: 'controller', name: 'OnlineOrderCtrl'};

// get all orders
onlineOrderCtrl.getAll = function(next) {
  onlineOrderDao.queryAll(function(err, data) {
    next(err, data);
  });
}

// insert an order
onlineOrderCtrl.add = function(data, next) {
  onlineOrderDao.insert(function(err, data) {
    next(err, data);
  })
}

module.exports = onlineOrderCtrl;