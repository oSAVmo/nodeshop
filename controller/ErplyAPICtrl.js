/** Erply API controller */
const api = require('../remoteAPI/ErplyAPI');
const log = require('../common/APILogger').erplyLog;

/* controller info */
let ctrl = {
  module: 'controller',
  name: 'ErplyAPICtrl'
}

/* call erply api with custom parameter (dev test tool only) */
ctrl.customAPICall = function(params) {

  let process = new Promise(function(resolve, reject) {

    try {
      api.callAPI(params, function(err, result, status) {

        if (err) {
          log.error(err);
          reject(status);
        } else if (status) {
          resolve(result);
        }
      });
    } catch (e) {
      reject(e.message);
    }
  });

  return process;
};

module.exports = ctrl;
