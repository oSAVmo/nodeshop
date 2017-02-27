const couponAPI = require('../remoteAPI/ErplyCoupon');
const couponDao = require('../dao/CouponDao');
const systemDao = require('../dao/SystemDao');
const log = require('../common/logger');

const SYS_SYNC_PAGE = 'issued_coupon_sync_page';

let ctrl = {
  module: 'controller',
  name: 'ErplyCouponCtrl'
};

/** synchronize issued coupons */
ctrl.syncIssuedCoupons = function () {
  return new Promise(function (resolve, reject) {
    systemDao.getSystemVar(SYS_SYNC_PAGE).then(result => {
      let currPage = result.value;
      if (currPage < 0) {
        reject({
          error: 'Synchronize is already finished, use update coupon please'
        });
      } else {
        syncIssuedCouponsNextPage(currPage, function (error, ret) {
          if (error) {
            log.error(error, ctrl, 25);
            reject(error);
          } else {
            systemDao.updateSystemVar(SYS_SYNC_PAGE, ret).then(
              result => {
                resolve(result);
              }).catch(reason => {
              reject(reason);
            }); // updateSystemVar
          } // if else
        }); // syncIssuedCouponsNextPage
      } // if else
    }).catch(reason => {
      reject(reason);
    }); // getSystemVar
  }); // promise
};

ctrl.expireCoupons = function (rule) {
  let yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  return new Promise((resolve, reject) => {
    couponDao.getCoupons(rule).then(coupons => {
      let data = coupons.map(coup => ({
        issuedCouponID: coup.ISSUED_COUPON_ID,
        expiryDate: require('../common/Utils').formatDateISO(yesterday)
      }));
      systemDao.insertTasks('erply', 'saveIssuedCoupon', data, 10).then(ret => {
        resolve(ret);
      }).catch(err => {
        log.error(err);
        reject(err);
      });
    }).catch(err => {
      log.error(err);
      reject(err);
    }); // getCoupons
  }); // Promise
};

/** sync coupons page by page */
function syncIssuedCouponsNextPage(page, callback) {

  couponAPI.getIssuedCouponsPage(page).then(rt => {
    couponDao.saveCoupons(rt.result).then(result => {
      let hasNextPage = (rt.status.recordsTotal > page * 1000);
      if (hasNextPage) {
        systemDao.updateSystemVar(SYS_SYNC_PAGE, page).then(result => {
          setTimeOut(function () {
            syncIssuedCouponsNext(page++, callback);
          }, 3000);
        }).catch(reasonSystem => {
          callback(reasonSystem, null);
        });
      } else {
        callback(0, -1);
      }
    }).catch(reasonSaveCoupons => {
      callback(reasonSaveCoupons, null);
    }); // saveCoupons
  }).catch(reasonGetCoupons => {
    callback(reasonGetCoupons, null);
  }); // getIssuedCouponsPage
}

module.exports = ctrl;