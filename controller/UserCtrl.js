var db = require('../dao/UserDao');
var log = require('../config/logger');

exports.userLogin = function(user, callback) {
  
  db.loginQuery(user.email, user.password, function(result) {
    if(result !== null || result !== undefined) {
      log.info('User: %j -- Login Success', {id: result.id, name: result.name});
      callback(result);
    } else {
      log.info('User Login Attempt fail: %s', user.email);
      callback(false);
    }
  });
}