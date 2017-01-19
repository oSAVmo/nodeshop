var transport = require('../config/email').sender();
var _us = require('underscore');
var log = require('./logger');

var mail = {
  data : {
    from : 'osavmailer@gmail.com',
    to : 'void_yw@hotmail.com',
    cc : '',
    replyTo : 'osavmailer@gmail.com',
    subject : 'Test Mail',
    text : 'If you recieve this by mistake, Ignore it.',
    html : '<b>If you recieve this by mistake, Ignore it.</b>'
  },
  send : function(pData, callback) {
    let mailData = _us.extend(this.data, pData);
    transport.sendMail(mailData, callback);
  }
}

module.exports = mail;
