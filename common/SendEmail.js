/** SendEmail */
const transport = require('../config/email').sender();
const _us = require('underscore');
const log = require('./logger');

let mail = {
  // Test data
  data: {
    from: 'osavmailer@gmail.com',
    to: 'void_yw@hotmail.com',
    cc: '',
    replyTo: 'osavmailer@gmail.com',
    subject: 'Test Mail',
    text: 'If you recieve this by mistake, Ignore it.',
    html: '<b>If you recieve this by mistake, Ignore it.</b>'
  },
  send: function(pData, callback) {
    // merge in actual mail info
    let mailData = _us.extend(this.data, pData);
    transport.sendMail(mailData, callback);
  }
}

module.exports = mail;
