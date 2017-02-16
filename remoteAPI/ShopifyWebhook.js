const shopifyAPI = require('ShopifyAPI');

var api = {
  module: 'api',
  name: 'ShopifyWebhook',

  /* list all webhooks */
  'list': new Promise(function(resolve, reject) {
    shopifyAPI.webhook.list().then(function(result) {
      resolve(result);
    }).catch(function(err) {
      reject(err);
    });
  }),

  /* get webhook by id */
  'get': function(id) {
    return new Promise(function(resolve, reject) {
      shopifyAPI.webhook.get(id).then(function(result) {
        resolve(result);
      }).catch(function(err) {
        reject(err);
      });
    });
  },

  /* create a webhook */
  'create': function(params) {
    return new Promise(function(resolve, reject) {
      shopifyAPI.webhook.create(params)
        .then(function(result) {
          resolve(result);
        }).catch(function(err) {
          reject(err);
        });
    });
  },

  /* delete a webhook */
  'delete': function(id) {
    return new Promise(function(resolve, reject) {
      shopifyAPI.webhook.delete(id).then(function(result) {
        resolve(result);
      }).catch(function(err) {
        reject(err, null);
      });
    });
  },

  /* update a webhook */
  'update': function(id, params) {
    return new Promise(function(resolve, reject) {
      shopifyAPI.webhook.update(id, params).then(function(result) {
        resolve(0, result);
      }).catch(function(err) {
        reject(err, null);
      });
    });
  }
};

module.exports = api;
