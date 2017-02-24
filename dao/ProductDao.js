/** Data access for products */
const mysql = require('../common/mysql');
const log = require('../common/logger');

"use strict";
/* DAO info */
let dao = {
  module: 'Dao',
  name: 'ProductDao'
};

/* insert multiple products */
dao.insertProducts = function(products) {

  // init promise
  let process = new Promise(function(resolve, reject) {

    // Result holders
    let successList = [];
    let failList = [];

    // db connection
    mysql.pool.getConnection(function(errConn, conn) {

      if (errConn) {
        reject(errConn);
      }
      // add all product into process list
      let saveProcesses = products.map(function(product) {
        return insertProduct(conn, product);
      });

      // resolve all processes
      Promise.all(saveProcesses).then(function(resolves) {

        // disconnect db
        conn.release();

        // save results
        resolves.forEach(function(thisResolve) {
          if (thisResolve.error) {
            log.error(thisResolve.error);
            failList.push(product);
          } else {
            successList.push(product);
          }
        });

        // TODO: consider wether to save results here or in the callback;

        // return the result lists
        resolve({
          successes: successList,
          fails: failList
        });
      });
    });
  });

  return process;
}

/** convert erply naming to sp DB naming */
dao.erply2Sp = function(product) {

  let buffer = {};

  for (let key in product) {
    if (product.hasOwnProperty(key)) {
      if (key === 'image' && product[key] && product[key].length > 0) {
        buffer['PICTURE_ID'] = product.image[0].pictureID;
        buffer['PICTURE_NAME'] = product.image[0].name;
        buffer['THUMB_URL'] = product.image[0].thumbURL;
        buffer['SMALL_URL'] = product.image[0].smallURL;
        buffer['LARGE_URL'] = product.image[0].largeURL;
        buffer['FULL_URL'] = product.image[0].fullURL;
        buffer['EXTERNAL'] = product.image[0].external;
        buffer['HOSTINGPROVIDER'] = product.image[0].hostingProvider;
      } else {
        buffer[dao.nameMapping[key]] = product[key];
      }
    }
  }
  return buffer;
};

/** name mapping */
dao.nameMapping = {
  'productID': 'PRODUCT_ID',
  'type': 'TYPE',
  'active': 'ACTIVE',
  'status': 'STATUS',
  'name': 'NAME',
  'code': 'CODE',
  'code2': 'CODE2',
  'code3': 'CODE3',
  'supplierCode': 'SUPPLIER_CODE',
  'code5': 'CODE5',
  'code6': 'CODE6',
  'code7': 'CODE7',
  'code8': 'CODE8',
  'groupID': 'GROUP_ID',
  'groupName': 'GROUP_NAME',
  'price': 'PRICE',
  'priceWithVat': 'PRICE_WITH_VAT',
  'displayedInWebshop': 'DISPLY_IN_WEBSHOP',
  'categoryID': 'CATEGORY_ID',
  'categoryName': 'CATEGORY_NAME',
  'supplierID': 'SUPPLIER_ID',
  'supplierName': 'SUPPLIER_NAME',
  'unitID': 'UNIT_ID',
  'unitName': 'UNIT_NAME',
  'taxFree': 'TAX_FREE',
  'deliveryTime': 'DELIVERY_TIME',
  'vatrateID': 'VATRATE_ID',
  'vatrate': 'VATRATE',
  'isGiftCard': 'IS_GIFT_CARD',
  'isRegularGiftCard': 'IS_REGULAR_GIFT_CARD',
  'manufacturerName': 'MANUFACTURER_NAME',
  'priorityGroupID': 'PRIORITY_GROUP_ID',
  'countryOfOriginID': 'COUNTRY_OF_ORIGIN_ID',
  'brandID': 'BRAND_ID',
  'brandName': 'BRAND_NAME',
  'width': 'WIDTH',
  'height': 'HEIGHT',
  'length': 'LENGTH',
  'rewardPointsNotAllowed': 'REWARD_POINTS_NOT_ALLOWED',
  'nonStockProduct': 'NON_STOCK_PRODUCT',
  'netWeight': 'NET_WEIGHT',
  'grossWeight': 'GROSSWEIGHT',
  'volume': 'VOLUME',
  'description': 'DESCRIPTION',
  'longdesc': 'LONGDESC',
  'descriptionENG': 'DESCRIPTION_ENG',
  'longdescENG': 'LONGDESC_ENG',
  'cost': 'COST',
  'backbarCharges': 'BACKBAR_CHARGES',
  'added': 'ADDED',
  'addedByUsername': 'ADDED_BY_USERNAME',
  'lastModified': 'LAST_MODIFIED',
  'lastModifiedByUsername': 'LAST_MODIFIED_BY_USERNAME',
  'productVariations': 'PRODUCT_VARIATIONS',
  'parentProductID': 'PARENT_PRODUCT_ID',
  'priceListPrice': 'PRICE_LIST_PRICE',
  'priceListPriceWithVat': 'PRICE_LIST_PRICE_WITH_VAT',
  'locationInWarehouse': 'LOCATION_IN_WAREHOUSE',
  'image[0].pictureID': 'PICTURE_ID',
  'image[0].name': 'PICTURE_NAME',
  'image[0].thumbURL': 'THUMB_URL',
  'image[0].smallURL': 'SMALL_URL',
  'image[0].largeURL': 'LARGE_URL',
  'image[0].fullURL': 'FULL_URL',
  'image[0].external': 'EXTERNAL',
  'image[0].hostingProvider': 'HOSTINGPROVIDER'
};

/** insert single product to MYSQL(for batch insert)(private) */
function insertProduct(conn, product) {

  let process = new Promise(function(resolve, reject) {
    try {
      // naming mapping
      let data = dao.erply2Sp(product);
      // insert product
      let thisInsert = conn.query(
        'INSERT INTO TAB_PRODUCTS VALUES ?', data,
        function(errQuery, results, fields) {
          if (errQuery) {
            resolve({
              error: errQuery,
              results: results
            });
          } else {
            resolve({
              error: 0,
              results: results
            });
          }
        }
      );
      log.debug(thisInsert.sql);
    } catch (e) {
      // resolves on error to avoid interupt on batch
      log.error(e);
      resolve({
        error: e,
        results: null
      });
    }
  });

  return process;
};

module.exports = dao;
