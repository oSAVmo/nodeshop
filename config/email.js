var nodemailer = require('nodemailer');

var mailer = {
  sender : function() {
    return nodemailer.createTransport({
      service : 'Gmail',
      auth : {
        user : 'osavmailer@gmail.com',
        pass : 'q0w9e8r7'
      }
    });
  }
}

module.exports = mailer;