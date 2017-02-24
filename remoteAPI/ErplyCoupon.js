const erplyAPI = require('./ErplyAPI');
const erplyLog = require('../common/APILogger.js').erplyLog;

let api = {
  module: 'api',
  name: 'ErplyIssuedCoupon'
};

api.getIssuedCouponsPage = function(page) {
  return new Promise(function(resolve, reject) {
    let param = {
      'request': 'getIssuedCoupons',
      'recordsOnPage': 1000,
      'pageNo': page
    }
    erplyAPI.callAPI(params, function(err, result, status) {
      if (err) {
        reject(err);
      } else {
        resolve({
          result: result,
          status: status
        });
      }
    });
  });
};

module.exports = api;
