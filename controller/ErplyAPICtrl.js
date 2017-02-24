/** Erply API controller */
const api = require('../remoteAPI/ErplyAPI');
const log = require('../common/APILogger').erplyLog;
const erplyProductAPI = require('../remoteAPI/ErplyProducts');
const erplyProductExtAPI = require('../remoteAPI/ErplyProductExt');
const productExtDao = require('../dao/ProductExtDao');
const systemDao = require('../dao/SystemDao');

/* controller info */
let ctrl = {
  module: 'controller',
  name: 'ErplyAPICtrl'
}

/* call erply api with custom parameter (dev test tool only) */
ctrl.customAPICall = function (params) {

  let process = new Promise(function (resolve, reject) {

    try {
      api.callAPI(params, function (err, result, status) {
        if (err) {
          reject(status);
        } else if (status) {
          resolve({
            status: status,
            data: result
          });
        }
      });
    } catch (e) {
      reject(e.message);
    }
  });

  return process;
};

ctrl.runSchedule = function () {
  return new Promise(function (resolve, reject) {
    systemDao.readNextTask('erply').then(task => {
      let params = task.doc;
      param.request = task.request;

      api.callAPI(params).then(result => {
        systemDao.removeTask(task._id);
        resolve(result);
      }).catch(error => {
        reject(error);
      });
    }).catch(error => {
      reject(error);
    });
  });
};

module.exports = ctrl;