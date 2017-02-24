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
productExtAPI.getAllUnits = function() {
  let proc = new Promise(function(resolve, reject) {
    let param = {
      'request': 'getProductUnits',
      'recordsOnPage': 1000
    };
    // get units from erply
    erplyAPI.callAPI(param, function(errAPI, result, status) {
      erplyLog.info(status);
      if (errAPI) {
        erplyLog.error(errAPI);
        reject(errAPI);
      } else {
        resolve(result);
      } // if else
    }); // callAPI
  }); // return new promise

  return proc;
}
module.exports = productExtAPI;
