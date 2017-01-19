var log = require('../common/logger');
var mail = require('../common/SendEmail');

var tests = {
    
  // test email module
  'testMail' : function(callback) {
    log.info('sending mail');
    mail.send({}, function(err, info) {
      log.info('send finished---Returning result...');
      if(err) {
        log.error(err);
      } else {
        log.info('send successful---Returning result...');
        callback(info);
      }
    });
  }
}

module.exports = tests;