var mysql = require('../config/mysql');
var userCtrl = require('../controller/UserCtrl');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/login', function(req, res, next) {
  var user = {
    email : req.params('email'),
    password : req.params('password')
  };

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