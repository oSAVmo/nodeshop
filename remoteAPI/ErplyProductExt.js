/** erply products api */
const erplyAPI = require('./ErplyAPI');
const systemDao = require('../dao/SystemDao');
const productExtDao = require('../dao/ProductExtDao');
const erplyLog = require('../common/APILogger.js').erplyLog;

let productExtAPI = {
  module: 'api',
  name: 'ErplyProductExt'
};

/* synchronize product units from erply */
productExtAPI.syncUnits = function() {
  return new Promise(function(resolve, reject) {
    let param = {
      'request': 'getProductUnits'
    };
    // get units from erply
    erplyAPI.callAPI(param, function(errAPI, result, status) {
      if (errAPI) {
        erplyLog.error(errAPI);
        reject(errAPI);
      } else {
        // save units to mysql
        productExtDao.saveUnits(result).then(function(result) {
          erplyLog.info(result);
        }).catch(function(err) {
          erplyLog.error(err);
          reject(err);
        });
      } // if else
    }); // callAPI
  }); // return new promise
};

module.exports = productExtAPI;
