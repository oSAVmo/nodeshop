/** User Controller */
var userDao = require('../dao/UserDao');
var log = require('../common/logger');

var userCtrl = {
  type: 'controller',
  name: 'UserCtrl'
};

/* login */
userCtrl.userLogin = function(user, callback) {
  let that = this;
  log.info('attempt: %j', user, that, 13);
  userDao.loginQuery(user.email, user.password, function(err, result) {
    if (err) {
      callback(true, 'System error');
    }
    if (result !== null && result !== undefined) {
      log.info('User: %j -- Login Success', {
        id: result._id,
        name: result.first_name + ' ' + result.last_name
      }, that.line = 22);
      callback(false, result);
    } else {
      log.info('User Login Attempt fail: %s', user.useremail,
        that.line = 25);
      callback(false, null);
    }
  });
}

/* reset admin password */
userCtrl.adminReset = function(user, callback) {
  // TODO
}

module.exports = userCtrl;
