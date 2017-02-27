/** API for Erply access */
const request = require('request');
const async = require('async');
const config = require('../config/conf').erplyTest;
const log = require('../common/logger');

const CALL_INTERVAL = 3 * 1000;

// init API params
let api = {
  module: 'baseAPI',
  name: 'ErplyAPI',
  sessionKey: null,
  sessionAquireTime: null,
  erplyURL: 'https://' + config.clientCode + '.erply.com/api/',
  queue: []
};

/* Call API with auto session key renew */
api.callAPI = function (params, callback) {
  if (api.queue.length > 100) {
    callback({
      error: 'Max Erply Queue Size Reached, Call again later.'
    });
    return;
  }
  let call = new Promise(function (resolve, reject) {
    // log.info('Start requesting ERPLY......', [api, 26]);
    let reqParam = {
      url: api.erplyURL
    };
    params.clientCode = config.clientCode;
    // session key exists
    if (api.sessionKey !== null) {
      reqParam.form = params;
      reqParam.form.sessionKey = api.sessionKey;
      // request api
      // log.info('Request with existing session key.', [api, 36]);
      request.post(reqParam, function (err, httpResponse, body) {
        if (err) {
          log.error(err);
          reject(err);
        }
        let firstRt = JSON.parse(body);
        let errCode = firstRt.status.errorCode;
        // session expired or error
        if (errCode === 1009 || errCode === 1054 || errCode === 1055 ||
          errCode === 1056 || errCode === 1001) {

          // get new session key
          verify(function (code) {
            // session key request fail
            if (code > 0) {
              reject(code);
              // got key: request with new session key
            } else {
              reqParam.form = params;
              reqParam.form.sessionKey = api.sessionKey;
              log.info('Request with new session key.', [api,
                57
              ]);
              request.post(reqParam, function (err2, httpResponse2,
                body2) {
                if (err2) {
                  log.error(err2);
                  reject(err2);
                }
                // return result
                resolve(JSON.parse(body2));
              });
            }
          });
          // no session error
        } else {
          // log.info('request with valid session key.', [api, 73]);
          resolve(firstRt);
        }
      });
      // no session key yet
    } else {
      // log.info('first login, getting session key...', [api, 79]);
      verify(function (code) {
        if (code > 0) {
          callback(code, null);
        } else {
          reqParam.form = params;
          reqParam.form.sessionKey = api.sessionKey;
          request.post(reqParam, function (err3, httpResponse3, body3) {
            if (err3) {
              reject(err3);
            }
            // return result
            resolve(JSON.parse(body3));
          }); // request.post
        } // if (code > 0)
      }); // verify
    } // if (api.sessionKey !== null)
  }); // promise

  if (callback) {
    call.then(ret => {
      callback(ret.status.errorCode, ret.records, ret.status);
    }).catch(reason => {
      callback(reason, null, null);
    });
  } else {
    return call;
  }
};

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

  try {
    request.post(param, function (err, httpResponse, body) {
      if (err) {
        log.error(err, [api, 125]);
        throw err;
      } else {

        let rt = JSON.parse(body);
        if (rt.status.errorCode === 0) {
          api.sessionKey = rt.records[0].sessionKey;
          api.sessionAquireTime = new Date();
          callback(0);
        } else {
          callback(rt.status.errorCode);
        }
      }

    });
  } catch (e) {
    log.error(e, [api, 141]);
    throw e;
  }
};

module.exports = api;