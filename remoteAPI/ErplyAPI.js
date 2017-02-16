/** API for Erply access */
const request = require('request');

const config = require('../config/conf').erplyTest;
const erplyLog = require('../common/APILogger').erplyLog;

// init API params
let api = {
  sessionKey: null,
  sessionAquireTime: null,
  erplyURL: 'https://' + config.clientCode + '.erply.com/api/'
};

/* Call API with auto session key renew */
api.callAPI = function(params, callback) {
  let reqParam = {
    url: api.erplyURL
  };

  params.clientCode = config.clientCode;

  erplyLog.info('SESSION KEY: ' + api.sessionKey);
  // session key exists
  if (api.sessionKey !== null) {
    reqParam.form = params;
    reqParam.form.sessionKey = api.sessionKey;
    // request api
    erplyLog.info('request with existing session key.');
    request.post(reqParam, function(err, httpResponse, body) {
      if (err) {
        erplyLog.error(err);
        throw err;
      }
      let firstRt = JSON.parse(body);
      let errCode = firstRt.status.errorCode;
      // session expired or error
      if (errCode === 1009 || errCode === 1054 || errCode === 1055 ||
        errCode === 1056 || errCode === 1001) {

        // get new session key
        verify(function(code) {
          // session key request fail
          if (code > 0) {
            callback(code, null, null);
            // got key: request with new session key
          } else {
            reqParam.form = params;
            reqParam.form.sessionKey = api.sessionKey;
            erplyLog.info('request with new session key.');
            request.post(reqParam, function(err2, httpResponse2,
              body2) {
              if (err2) {
                erplyLog.error(err2);
                throw err2;
              }
              // return result
              let rt = JSON.parse(body2);
              callback(rt.status.errorCode, rt.records,
                rt.status);
            });
          }
        });
        // no session error
      } else {
        erplyLog.info('request with valid session key.');
        callback(firstRt.status.errorCode, firstRt.records, firstRt.status);
      }
    });
    // no session key yet
  } else {
    erplyLog.info('first login, getting session key...');
    verify(function(code) {
      if (code > 0) {
        callback(code, null);
      } else {
        reqParam.form = params;
        reqParam.form.sessionKey = api.sessionKey;
        erplyLog.info(api);
        erplyLog.info(reqParam);
        request.post(reqParam, function(err3, httpResponse3, body3) {
          if (err3) {
            throw err3;
          }

          let rt = JSON.parse(body3);
          callback(rt.status.errorCode, rt.records, rt.status);
        });
      }
    });
  }
}

/* verify user and get session key */
function verify(callback) {
  param = {
    url: api.erplyURL,
    form: {
      clientCode: config.clientCode,
      username: config.username,
      password: config.password,
      sessionLength: config.sessionLength,
      request: 'verifyUser'
    }
  };

  erplyLog.info(param);
  try {
    console.log('Getting session key...');
    request.post(param, function(err, httpResponse, body) {
      if (err) {
        erplyLog.error(err);
        throw err;
      } else {

        let rt = JSON.parse(body);
        erplyLog.info(rt);
        if (rt.status.errorCode === 0) {
          api.sessionKey = rt.records[0].sessionKey;
          erplyLog.info("sessionKey aquired: ");
          erplyLog.info(api.sessionKey);
          api.sessionAquireTime = new Date();
          callback(0);
        } else {
          callback(rt.status.errorCode);
        }
      }

    });
  } catch (e) {
    erplyLog.error(e);
    throw e;
  }
};

module.exports = api;
