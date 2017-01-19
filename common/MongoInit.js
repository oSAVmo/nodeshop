var md5 = require('../common/Utils').md5;
var mongo = require('./mongo');
var log = require('./logger');
var systemConst = require('../config/conf').system;

var initModel = {};

/** initialize database and initial data */
initModel.init = function() {

  initModel.db = mongo.conn;
    
  log.info('Check system variables');
  // find init value
  systemVar = initModel.db.collection('system_var');
  
  systemVar.findOne({
    name : 'mongo_init'
  }, {
    fields : {
      'name' : 1,
      'value' : 1
    }
  }).then(function(result) {
    
    log.info('mongo_init: %j', result);
    
    // no init done
    if (result === undefined || result.length === 0 || systemConst.forceMongoInit) {
      log.info('init user...');
      // init user table
      initUser(function(err1, data) {
        if (err1) {
          log.error(err1);
          return;
        } else {
          log.info('update system variable...');
          // set mongo init done
          systemVar.insertOne({
            name : 'mongo_init',
            value : 1
          }, function(err99, data) {
            if (err99) {
              log.error(err99);
            }
          });
          // -------------------------------
        }
      });
    } else {
      log.info('Data of MongoDB is already initialized.');
    }
  }).catch(function(err) {
    log.error(err);
  });
};

/** Initialize admin user in database */
function initUser(callback) {

  try {
    initModel.db.createCollection('system_user');
  } catch(e) {
    log.error(e);
  }

  let coUse = initModel.db.collection('system_user');
  let defaultAdmin = {
    user_email : systemConst.adminEmail,
    password : md5(systemConst.adminReset),
    role : 'admin',
    privilige : '*'
  };

  coUse.insertOne(defaultAdmin, function(err, data) {
    if (err) {
      console.log(err);
    } else if (data.result.ok !== 1) {
      console.log("Insert Failed.");
    } else {
      callback(err, data);
    }
  });
};

module.exports = initModel;
