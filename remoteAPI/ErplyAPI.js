const request = require('request');

const config = require('../config/conf.js').erplyTest;
const erplyLog = require('../common/APILogger.js').erplyLog;

var api = {
  sessionKey : null,
  sessionAquireTime : null,
  erplyURL : 'https://' + config.code + '.erply.com/api/'
};

/** verify user and get session key */
api.verify = function(callback) {
  param = {
    url : api.erplyURL,
    form : {
      clientCode : config.clientCode,
      username : config.username,
      password : config.password,
      sessionLength : config.sessionLength,
      request : 'verifyUser'
    }
  };
  try {
    request.post(param, function(err, httpResponse, body) {
      if (err) {
        erplyLog.error(err);
        throw err;
      }
      if (body.status.errorCode === 0) {
        api.sessionKey = body.records.sessionKey;
        api.sessionAquireTime = new Date();
        callback(0);
      } else {
        callback(body.status.errorCode);
      }

    });
  } catch (e) {
    erplyLog.error(e);
    throw e;
  }
};

/**
 * Call API with auto session key renew
 */
api.callAPI(params, callback) {
  // session key exists
  if (api.sessionKey !== null) {

    // request api
    erplyLog.info('request with existing session key.');
    request.post(params, function(err, httpResponse, body) {
      if (err) {
        erplyLog.error(err);
        throw err;
      }
      let errCode = body.status.errorCode;
      // session expired or error
      if (errCode === 1009 || errCode === 1054 || errCode === 1055 || errCode === 1056) {

        // get new session key
        api.verify(function(code) {
          // session key request fail
          if (code > 0) {
            callback(code, null);
            // got key: request with new session key
          } else {
            erplyLog.info('request with new session key.');
            request.post(params, function(err2, httpResponse2, body2) {
              if (err2) {
                erplyLog.error(err2);
                throw err2;
              }
              // return result
              callback(body2.status.errorCode, body2.records);
            });
          }
        });
        // no session error
      } else {
        erplyLog.info('request with valid session key.');
        callback(errCode, body.records);
      }
    });
    // no session key yet
  } else {
    api.verify(function(code) {
      if (code > 0) {
        callback(code, null);
      } else {
        request.post(params, function(err2, httpResponse2, body2) {
          if (err2) {
            throw err2;
          }
          callback(body2.status.errorCode, body2.records);
        });
      }
    });
  }
}

module.exports = api;
