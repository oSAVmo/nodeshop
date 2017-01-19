const
shopifyAPI = require('ShopifyAPI');

var api = {
  'list' : function(callback) {
    shopifyAPI.webhook.list()
      .then(callback(0, result)).catch(callback(err, null));
  },
  'get' : function (id, callback) {
    shopifyAPI.webhook.get(id)
      .then(callback(0, result)).catch(callback(err, null));
  },
  'create' : function(params, callback) {
    shopifyAPI.webhook.create(params)
      .then(callback(0, result)).catch(callback(err, null));
  },
  'delete' : function(id, callback) {
    shopifyAPI.webhook.delete(id)
      .then(callback(0, result)).catch(callback(err, null));
  },
  'update' : function(id, params, callback) {
    shopifyAPI.webhook.update(id, params)
      .then(callback(0, result)).catch(callback(err, null));
  }
};

module.exports = api;