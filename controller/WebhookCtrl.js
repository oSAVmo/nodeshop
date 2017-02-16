/** Controller for webhooks with Shopify */
const webhookAPI = require('../remoteAPI/Webhook');
const log = require('../common/logger');
var ctrl = {
  /* controller info */
  module: 'controller',
  name: 'WebhookCtrl',

  /* list all webhooks */
  'list': function(callback) {
    webhookAPI.list(function(err, result) {
      if (err) {
        log.error(err);
        callback(err, null);
      } else {
        var webhooks = result.webhooks;
        if (webhooks.length > 0) {
          callback(0, webhooks);
        } else {
          callback(0, null);
        }
      }
    });
  },

  /* get webhook info by id */
  'get': function(id, callback) {
    webhookAPI.get(id, function(err, result) {
      if (err) {
        log.error(err);
        callback(err, null);
      } else {
        if (result === null) {
          callback(0, null)
        } else {
          callback(0, result.webhook);
        }
      }
    });
  },

  /* create a webhook */
  'create': function(params, callback) {
    webhookAPI.create(params, function(err, result) {
      if (err) {
        log.error(err);
        callback(err, null);
      } else {
        callback(0, result.webhook.id);
      }
    });
  },

  /* delete a webhook */
  'delete': function(id, callback) {
    webhookAPI.delete(id, function(err, result) {
      if (err) {
        log.error(err);
        callback(err, null);
      } else {
        callback(0, null);
      }
    });
  },

  /* update a webhook */
  'update': function(id, address, callback) {
    webhookAPI.update(id, {
      address: address
    }, function(err, result) {
      if (err) {
        log.error(err);
        callback(err, null);
      } else {
        callback(0, result.webhook.id);
      }
    });
  }
};
