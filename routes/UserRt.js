var md5 = require('../common/Utils').md5;
var userCtrl = require('../controller/UserCtrl');
var log = require('../config/logger');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  
  var user = {
    email : 'void_yw@hotmail.com',
    password : md5('kof980')
  };
  
  log.info(user);
  
  userCtrl.userLogin(user, function(result) {
    if (result) {
      // session
      res.json({
        error : 0,
        data : result,
        msg : 'Login Success'
      });
    } else {
      res.json({
        error : 0,
        data : false,
        msg : 'Login Fail'
      });
    }
  });
});

module.exports = router;