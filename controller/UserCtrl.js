var userDao = require('../dao/UserDao');
var log = require('../config/logger');

exports.userLogin = function(user, callback) {
  
  userDao.loginQuery(user.email, user.password, function(result) {
    if(result !== null && result !== undefined && result.length > 0) {
      log.info('User: %j -- Login Success', {id: result.id, name: result.name});
      callback(result);
    } else {      
      log.info('User Login Attempt fail: ', result);
      callback(false);
    }
  });
}