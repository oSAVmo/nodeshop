const log = require('../common/APILogger').erplyLog;
const erplyProductAPI = require('../remoteAPI/ErplyProducts');
const erplyProductExtAPI = require('../remoteAPI/ErplyProductExt');
const productExtDao = require('../dao/ProductExtDao');

/* controller info */
let ctrl = {
  module: 'controller',
  name: 'ErplyProductExtCtrl'
}

/* Sync units */
ctrl.syncUnits = function() {
  let proc = new Promise(function(resolve, reject) {
    log.info('Requesting erply for units...');
    // get units from erply
    erplyProductExtAPI.getAllUnits().then(function(erplyResult) {
      log.info('Units return from erply...');
      productExtDao.saveUnits(erplyResult).then(function(daoResult) {
        log.info('Units saved.');
        resolve(daoResult);
      }).catch(function(daoError) {
        log.info('Units save ERROR.');
        reject(daoError);
      });
    }).catch(function(erplyError) {
      log.error('Erply request error.');
      reject(erplyError);
    });
  });

  return proc;
};
