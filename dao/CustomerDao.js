/** Data access for customers */
const mysql = require('../common/mysql');
const log = require('../common/logger');

const CUSTOMER_FIELDS = ['CUSTOMER_ID',
  'CUSTOMER_TYPE',
  'COMPANY_NAME',
  'FIRST_NAME',
  'LAST_NAME',
  'GENDER',
  'GROUP_ID',
  'GROUP_NAME',
  'PAYER_ID',
  'PHONE',
  'MOBILE',
  'EMAIL',
  'FAX',
  'CODE',
  'BIRTHDAY',
  'INTEGRATION_CODE',
  'FLAG_STATUS',
  'COLOR_STATUS',
  'IMAGE',
  'TAX_EXEMPT',
  'PAYS_VIA_FACTORING',
  'REWARD_POINTS',
  'CREDIT',
  'SALES_BLOCKED',
  'REFERENCE_NUMBER',
  'CUSTOMER_CARD_NUMBER',
  'REWARD_POINTS_DISABLED',
  'POS_COUPONS_DISABLED',
  'EMAIL_OPT_OUT',
  'LAST_MODIFIER_USERNAME',
  'SHIP_GOODS_WITH_WAYBILLS',
  'ACTUAL_BALANCE',
  'CREDIT_LIMIT',
  'AVAILABLE_CREDIT',
  'CREDIT_ALLOWED',
  'ADDRESS',
  'STREET',
  'ADDRESS2',
  'CITY',
  'POSTAL_CODE',
  'STATE',
  'COUNTRY',
  'ADDRESS_TYPE_ID',
  'ADDRESS_TYPE_NAME'
];

const CUSTOMER_FIELDS_INSERT = CUSTOMER_FIELDS.reduce((acc, field) => (acc + ', ' + field));
const CUSTOMER_DUPKEY_UPDATE = CUSTOMER_FIELDS.slice(1).reduce((acc, field) => (acc + field + ' = VALUES(' + field + ')'));

let dao = {
  module: 'dao',
  name: 'CustomerDao'
};

dao.saveCustomers = function (customers) {
  return new Promise((resolve, reject) => {
    mysql.pool.getConnection((errConn, conn) => {
      if (errConn) {
        reject(errConn);
      } else if (!customers || customers.length === 0) {
        resolve(null);
      } else {

        let sql = ' INSERT INTO SP_TAB_CUSTOMER (' + CUSTOMER_FIELDS_INSERT + ') VALUES ?' +
          ' ON DUPLICATE KEY UPDATE ' + CUSTOMER_DUPKEY_UPDATE;

        let values = customers.map(cust => [
          cust.customerID, cust.customerType, cust.companyName, cust.firstName, cust.lastName, cust.gender, cust.groupID,
          cust.groupName, cust.payerID, cust.phone, cust.mobile, cust.email, cust.fax, cust.code, cust.birthday,
          cust.integrationCode, cust.flagStatus, cust.colorStatus, cust.image, cust.taxExempt, cust.paysViaFactoring,
          cust.rewardPoints, cust.credit, cust.salesBlocked, cust.referenceNumber, cust.customerCardNumber,
          cust.rewardPointsDisabled, cust.posCouponsDisabled, cust.emailOptOut, cust.lastModifierUsername,
          cust.shipGoodsWithWaybills, cust.actualBalance, cust.creditLimit, cust.availableCredit, cust.creditAllowed,
          cust.address, cust.street, cust.address2, cust.city, cust.postalCode, cust.state, cust.country, cust.addressTypeID,
          cust.addressTypeName
        ]);

        let fSQL = conn.format(sql, [inserts]);
        conn.query(fSQL, function (errQuery, results, fields) {
          conn.release();
          if (errQuery) {
            reject(errQuery);
          } else {
            resolve(results);
          }
        }); // query
      } // if else
    }); // getConnection
  }); // Promise
};