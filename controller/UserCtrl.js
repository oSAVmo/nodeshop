var userDao = require('../dao/UserDao');
var log = require('../common/logger');

var userCtrl = {
    type: 'controller',
    name: 'UserCtrl'
};

/** login controller */
userCtrl.userLogin = function(user, callback) {

  log.info('attempt: %j', user);
  userDao.loginQuery(user.email, user.password, function(err, result) {
    if (err) {
      callback(true, 'System error');
    }
    if (result !== null && result !== undefined) {
      log.info('User: %j -- Login Success', {
        id : result.id,
        name : result.name
      });
      callback(false, result);
    } else {
      log.info('User Login Attempt fail: ', result);
      callback(false, null);
    }
  });
}

/** reset admin controller */
userCtrl.adminReset = function(user, callback) {
  
}

module.exports = userCtrl;