var mysql = require('../config/mysql');
var log = require('../config/logger');

var userDao = {
  module : 'dao',
  name : 'UserDao'
};

userDao.queryByEmail = function(email) {
  let sql = 'SELECT * FROM USERS WHERE EMAIL = ?';
  let binding = [email];
  mysql.conn.query(sql, binding);
}