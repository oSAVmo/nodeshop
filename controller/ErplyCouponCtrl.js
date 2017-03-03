const couponAPI = require('../remoteAPI/ErplyCoupon');
const couponDao = require('../dao/CouponDao');
const systemDao = require('../dao/SystemDao');
const log = require('../common/logger');

const SYS_COUPON_SYNC_PAGE = 'issued_coupon_sync_page';

let ctrl = {
  module: 'controller',
  name: 'ErplyCouponCtrl'
};

/** 
 * synchronize issued coupons 
 */
ctrl.syncIssuedCoupons = function () {
  return new Promise(function (resolve, reject) {
    systemDao.getSystemVar(SYS_COUPON_SYNC_PAGE).then(result => {
      let currPage = result.value ? result.value : 1;
      let changedSince = null;
      if (currPage < 0) {
        currPage = 1;
        changedSince = result.time;
      }
      syncIssuedCouponsNextPage(currPage, changedSince, function (error, ret) {
        if (error) {
          log.error(error, ctrl, 25);
          reject(error);
        } else {
          log.debug(ret);
          systemDao.updateSystemVar({
            name: SYS_COUPON_SYNC_PAGE,
            value: ret.page,
            time: ret.time
          }).then(
            result => {
              resolve(result);
            }).catch(reason => {
            reject(reason);
          }); // updateSystemVar
        } // if else
      }); // syncIssuedCouponsNextPage
    }).catch(reason => {
      reject(reason);
    }); // getSystemVar
  }); // promise
};

/**
 * Make coupon expire
 */
ctrl.expireCoupons = function (rule) {
  let yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  return new Promise((resolve, reject) => {
    // only expire active coupons
    rule.status = 'ACTIVE';
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

/** 
 * get unique coupon codes 
 */
ctrl.getUniqCouponCode = function () {
  return new Promise((resolve, reject) => {
    couponDao.getUniqCouponCode().then(result => {
      resolve(result);
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * sync coupons page by page
 */
function syncIssuedCouponsNextPage(page, changedSince, callback) {

  couponAPI.getIssuedCouponsPage(page, changedSince).then(rt => {
    let syncTime = rt.status.requestUnixTime;
    couponDao.saveCoupons(rt.result).then(result => {
      log.debug('sync coupon page: ' + page);
      let hasNextPage = (rt.status.recordsTotal > page * 100);
      if (hasNextPage) {
        systemDao.updateSystemVar({
          name: SYS_COUPON_SYNC_PAGE,
          value: page
        }).then(result => {
          setTimeout(function () {
            syncIssuedCouponsNextPage(page + 1, changedSince, callback);
          }, 3000);
        }).catch(reasonSystem => {
          callback(reasonSystem, null);
        });
      } else {
        callback(0, {
          page: -1,
          time: syncTime
        });
      }
    }).catch(reasonSaveCoupons => {
      callback(reasonSaveCoupons, null);
    }); // saveCoupons
  }).catch(reasonGetCoupons => {
    callback(reasonGetCoupons, null);
  }); // getIssuedCouponsPage
}

module.exports = ctrl;