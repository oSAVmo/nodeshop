const erplyAPI = require('./ErplyAPI');
const log = require('../common/logger.js');

let api = {
  module: 'api',
  name: 'ErplyIssuedCoupon'
};

api.getIssuedCouponsPage = function (page) {
  return new Promise(function (resolve, reject) {
    let params = {
      'request': 'getIssuedCoupons',
      'recordsOnPage': 1000,
      'pageNo': page
    }
    erplyAPI.callAPI(params, function (err, result, status) {
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