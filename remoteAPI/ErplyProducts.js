/** Erply Product API */
const erplyAPI = require('./ErplyAPI');
const systemDao = require('../dao/SystemDao');
const productDao = require('../dao/ProductDao');
const erplyLog = require('../common/APILogger.js').erplyLog;

const ERPLY_SYNC_PAGE = 'erply_product_sync_page'

/* api info */
let productAPI = {
  module: 'api',
  name: 'ErplyProduct'
};

/* sync all products */
productAPI.syncAll = function(callback) {
  systemDao.getSystemVar(ERPLY_SYNC_PAGE).then(function(result) {
    let param = {
      'request': 'getProducts',
      'orderBy': 'productID',
      'orderByDir': 'desc',
      'getMatrixVariations': 1,
      'recordsOnPage': 1000,
      'pageNo': result.value
    };
  });
  syncPages(param, function() {
    erplyLog.info("product sync finished.");
    callback(true);
  });
};

/* sync product page by page */
function syncPages(param, callback) {
  erplyAPI.callAPI(param, function(err, result, status) {
    if (err) {
      systemDao.updateSystemVar(ERPLY_SYNC_PAGE, param.pageNo).then(
        function(result) {
          erplyLog.info('Product Sync stopped at page %i', param.pageNo);
        }).catch(function(err2) {
        erplyLog.error(
          'Product Sync stopped at page %i, and failed to save page.',
          param.pageNo);
      }); // updateSysemVar
      throw err;
    } else {
      // insert product into MySQL
      productDao.insertProducts(result).then(function(result) {
        // if there is next page
        if (status.recordsInResponse === param.recordsOnPage) {
          param.pageNo = param.pageNo + 1;
          // Time the api call for next page to avoid exceed erply call limits
          setTimeOut(function() {
            syncPages(param, function() {
              erplyLog.info('sync at %j', param);
            });
          }, 2000);
        } else {
          callback();
        }
      }); // insertProducts
    } // if else
  }); // callAPI
} // end function

module.exports = productAPI;
