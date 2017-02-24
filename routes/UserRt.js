const md5 = require('../common/Utils').md5;
const userCtrl = require('../controller/UserCtrl');
const log = require('../common/logger');

const ObjectID = require('mongodb').ObjectID;
const express = require('express');
const router = express.Router();

/** login */
router.post('/login', function(req, res, next) {

  let user = {
    email: req.body.useremail,
    password: md5(req.body.password)
  };

  userCtrl.userLogin(user, function(error, result) {
    if (error) {
      res.json({
        error: 1,
        data: false,
        msg: 'System Error'
      });
    }
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
