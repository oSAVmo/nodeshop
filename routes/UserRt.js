var md5 = require('../common/Utils').md5;
var userCtrl = require('../controller/UserCtrl');
var log = require('../common/logger');

var ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();

/** login */
router.get('/login', function(req, res, next) {

  log.info('useremail: ' + req.query.useremail);
  log.info('password: ' + req.query.password);
  var user = {
    email : req.query.useremail,
    password : md5(req.query.password)
  };

  userCtrl.userLogin(user, function(error, result) {
    if(error) {
      res.json({
        error : 1,
        data : false,
        msg : 'System Error'
      });
    }
    log.info(result);
    if (result) {
      // session
      req.session.user = result;
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