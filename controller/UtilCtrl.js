/** General management tools */
var log = require('../common/logger');
var mail = require('../common/SendEmail');

var util = {
  /* email */
  'email': function(mailData, callback) {
    mail.send(mailData, function(err, info) {
      if (err) {
        log.error(err);
        callback(false);
      } else {
        callback(true);
      }
    });
  }
}

exports.email = util.email;
