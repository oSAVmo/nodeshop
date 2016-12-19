var mysql = require('../config/mysql');
var log = require('../config/logger');

var userDao = {
  module : 'dao',
  name : 'UserDao'
};

userDao.queryByEmail = function(email, callback) {
  var that = this;
  let sql = 'SELECT * FROM USERS WHERE EMAIL = ?';
  let binding = [email];
  var result = null;
  try {
    result = mysql.conn.query(sql, binding);
    callback(result);
  } catch(err) {
    log.error('MYSQL DB: %j at %j', err, that);
    throw new Error('MySQL Error.')
  }
}

userDao.loginQuery = function(email, password,  callback) {
  var that = this;
  let sql = 'SELECT ID, EMAIL FROM USERS WHERE EMAIL = ? AND PASSWORD = ?';
  let binding = [email, password];
  var result = null;
  try {
    mysql.pool.query(sql, binding, function(err, rows, fields) {
      if(err) throw new Error(err);
      callback(rows);
    });
    
  } catch(err) {
    log.info('MYSQL DB: ', err, that);
    throw new Error('MySQL Error.')
  }
}

userDao.createUser = function(user, callback) {
  callback();
}

module.exports = userDao;