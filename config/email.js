/** node mailer initialize */
var nodemailer = require('nodemailer');
var conf = require('./conf');

var mailer = {
  sender: function() {
    return nodemailer.createTransport({
      service: conf.email.service,
      auth: {
        user: conf.email.account,
        pass: conf.email.password
      }
    });
  }
}

module.exports = mailer;
