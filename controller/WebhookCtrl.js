const webhookAPI = require('../remoteAPI/Webhook');
const log = require('../common/logger');
var ctrl = {
    'list' : function(callback) {
      webhookAPI.list(function(err, result) {
        if(err) {
          log.error(err);
          callback(err, null);
        } else {
          var webhooks = result.webhooks;
          if(webhooks.length > 0) {
            callback(0, webhooks);
          } else {
            callback(0, null);
          }
        }
      });
    },
    
    'get' : function(id, callback) {
      webhookAPI.get(id, function(err, result) {
        if(err) {
          log.error(err);
          callback(err, null);
        } else {
          if(result === null) {
            callback(0, null)
          } else {
            callback(0, result.webhook);
          }
        }
      });
    },
    
    'create' : function(params, callback) {
      webhookAPI.create(params, function(err, result) {
        if(err) {
          log.error(err);
          callback(err, null);
        } else {
          callback(0, result.webhook.id);
        }
      });
    },
    
    'delete' : function(id, callback) {
      webhookAPI.delete(id, function(err, result) {
        if(err) {
          log.error(err);
          callback(err, null);
        } else {
          callback(0, null);
        }
      });
    },
    
    'update' : function(id, address, callback) {
      webhookAPI.update(id, {address: address}, function(err, result) {
        if(err) {
          log.error(err);
          callback(err, null);
        } else {
          callback(0, result.webhook.id);
        }
      });
    }
};