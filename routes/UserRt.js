var md5 = require('../common/Utils').md5;
var userCtrl = require('../controller/UserCtrl');
var log = require('../common/logger');

var ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();

/** login */
router.post('/login', function(req, res, next) {

  log.info('useremail: ' + req.body.useremail);
  log.info('password: ' + req.body.password);
  var user = {
    email: req.body.useremail,
    password: md5(req.body.password)
  };

  log.info(user);

  userCtrl.userLogin(user, function(error, result) {
    if (error) {
      res.json({
        error: 1,
        data: false,
        msg: 'System Error'
      });
    }
    log.info(result);
    if (result) {
      // session
      req.session.user = result;
      res.json({
        error: 0,
        data: result,
        msg: 'Login Success'
      });
    } else {
      res.json({
        error: 0,
        data: false,
        msg: 'Login Fail'
      });
    }
  });
});

module.exports = router;
