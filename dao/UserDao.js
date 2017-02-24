/** User data access */
var md5 = require('../common/Utils').md5;
var mysql = require('../common/mysql');
var mongo = require('../common/mongo');
var log = require('../common/logger');

/* DAO info */
var userDao = {
  module: 'dao',
  name: 'UserDao'
};

/* get user by email */
userDao.queryByEmail = function(email, callback) {

  var param = {
    user_email: email
  };

  var collect = mongo.conn.collection('system_user');
  collect.findOne(param).then(function(err, data) {
    if (err) {
      log.err(err, userDao);
    }
    callback(err, data);
  }).catch(function(err) {
    log.error(err, userDao);
    callback(err, null);
  });
};

/** user login */
userDao.loginQuery = function(email, password, callback) {

  let param = {
    user_email: email,
    password: password
  };

  let collect = mongo.conn.collection('system_user');
  collect.findOne(param, {
    fields: {
      'password': 0
    }
  }).then(function(data) {
    callback(0, data);
  }).catch(function(err) {
    log.error(err);
    callback(err, null);
  });
};

/** reset admin password */
userDao.resetAdmin = function(callback) {

  let adminUser = require('../config').system
  let collect = mongo.conn.collection('system_user');
  collect.findOneAndUpdate({
      user_email: adminUser.adminEmail
    }, {
      $set: {
        password: md5(adminUser.adminReset)
      }
    }, {
      returnOriginal: false
    }),
    function(err, data) {
      callback(err, data);
    };
};

/* create user */
userDao.createUser = function(user, callback) {

  var collect = mongo.conn.collection('system_user');
  collect.insertOne(user, function(err, data) {
    callback(err, data);
  })
};

/* change password */
userDao.changePassword = function(email, password, newPass, callback) {
  let user = {
    user_email: email,
    password: password
  };
  const collect = mongo.conn.collection('system_user');
  collect.findOne(user).next(function(err, data) {
    if (err) {
      callback(err, data);
    } else if (data.length < 1) {
      callback({
        err: 1,
        message: 'user not found or wrong original password.'
      }, null);
    } else {
      mongo.conn.findOneAndUpdate(user, {
        $set: {
          password: newPass
        }
      }, function(err, data) {
        callback(err, data);
      });
    }
  })
};

module.exports = userDao;
