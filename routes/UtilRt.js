var log = require('../config/logger');
var emailCtrl = require('../controller/UtilCtrl').email;

var express = require('express');
var router = express.Router();

router.post('/mail', function(req, res, next) {
  
  var mailData = {
    to : req.body.emailto,
    cc : req.body.cclist,
    replyTo : 'christinachenjy@gmail.com',
    subject : req.body.subject,
    html : req.body.emailContent
  }
  
  emailCtrl(mailData, function(success) {
    if (success) {
      res.json({
        error : 0,
        data : {},
        msg : 'Mail Sent.'
      });
    } else {
      res.json({
        error : 1,
        data : {},
        msg : 'Mail failed to send, Contact admin to check mail server.'
      });
    }
  });
});

module.exports = router;