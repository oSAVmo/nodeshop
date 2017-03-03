const erplyAPI = require('./ErplyAPI');
const log = require('../common/logger.js');

let api = {
  module: 'api',
  name: 'ErplyCustomer'
};

api.getCustomerPage = function (page, changedSince) {
  return new Promise(function (resolve, reject) {
    let params = {
      'request': 'getCustomers',
      'recordsOnPage': 100,
      'pageNo': page,
      'orderBy': 'customerID',
      'orderByDir': 'DESC'
    };

    if (changedSince) {
      params.changedSince = changedSince;
    }

    log.debug(params);
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