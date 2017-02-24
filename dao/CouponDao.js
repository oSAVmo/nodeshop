/** Data access for coupons */
const mysql = require('../common/mysql');
const log = require('../common/logger');

const ISSUED_COUPON_FIELDS =
  'ISSUED_COUPON_ID,COUPON_ID,COUPON_CODE,CAMPAIGN_NAME,UID,ISSUED_TIMESTAMP,EXPIRY_DATE,STATUS,ADDED';

let dao = {
  module: 'dao',
  name: 'CouponDao'
};

dao.saveCoupons = function(coupons) {
  return new Promise(function(resolve, reject) {
    mysql.getConnection(function(errConn, conn) {
      if (errConn) {
        reject(errConn);
      } else {
        let sql =
          'INSERT INTO SP_TAB_ISSUED_COUPON(' + ISSUED_COUPON_FIELDS +
          ') VALUES ?';
        let data = coupons.map(coup => [
          coup.issuedCouponID,
          coup.couponID,
          coup.couponCode,
          coup.campaignName,
          coup.uniqueIdentifier,
          coup.issuedTimestamp,
          coup.expiryDate,
          coup.status,
          coup.added
        ]);
        conn.query(sql, [data], function(errQuery, results, fields) {
          conn.release();
          if (errQuery) {
            reject(errQuery);
          } else {
            resolve(results);
          }
        }); // query
      } // if else
    }); // getConnection
  }); // promise
};

dao.getCoupons = function(queryParam) {
  return new Promise(function(resolve, reject) {
    mysql.getConnection(function(errConn, conn) {
      if (errConn) {
        reject(errConn);
      } else {
        let sql =
          'SELECT ' + ISSUED_COUPON_FIELDS +
          'FROM SP_TAB_ISSUED_COUPON';

        if (queryParam) {
          sql += ' WHERE ?'
        }

        conn.query(sql, queryParam, function(errQuery, results,
          fields) {
          conn.release();
          if (errQuery) {
            reject(errQuery);
          } else {
            resolve(results);
          }
        }); // query
      } // if else
    }); // getConnection
  }); // promise
};

module.exports = dao;
