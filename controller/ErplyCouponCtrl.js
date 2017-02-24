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
ctrl.syncIssuedCoupons = function() {
  return new Promise(function(resolve, reject) {
    systemDao.getSystemVar(SYS_SYNC_PAGE).then(result => {
      let currPage = result.value;
      if (currPage < 0) {
        reject({
          error: 'Synchronize is already finished, use update coupon please'
        });
      } else {
        syncIssuedCouponsNextPage(currPage, function(error, ret) {
          if (error) {
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

ctrl.expireCoupons = async function(rule) {
  let yesterday = Date.now().setDate(Date.now().getDate() - 1);

  try {
    let coupons = await couponDao.getCoupons(rule);

    let processes = coupons.map(async coup => {
      let data = {
        issuedCouponID: coup.ISSUED_COUPON_ID
        expiryDate: require('../common/Utils').formatDateISO(yesterday);
      };
      return await systemDao.insertTask('erply', 'saveIssuedCoupon',
        data, 10);
    });

    let rets = [];
    for (const process of processes) {
      rets.push(await process)
    }

    return rets;
  } catch (e) {
    throw e;
  }
}

/** sync coupons page by page */
function syncIssuedCouponsNextPage(page, callback) {

  couponAPI.getIssuedCouponsPage(page).then(rt => {
    couponDao.saveCoupons(rt.result).then(result => {
      let hasNextPage = (rt.status.recordsTotal > page * 1000);
      if (hasNextPage) {
        systemDao.updateSystemVar(SYS_SYNC_PAGE, page).then(result => {
          setTimeOut(function() {
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
