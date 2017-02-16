/** Data access for products */
const mysql = require('../common/mysql');
const log = require('../common/logger');

/* DAO info */
let dao = {
  module: 'Dao',
  name: 'ProductDao'
};

/* insert multiple products */
dao.insertProducts = function(products) {

  // init promise
  let process = new Promise(functin(resolve, reject) {

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
        return dao.saveProduct(conn, product);
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

/** insert single product to MYSQL(for batch insert) */
dao.insertProduct = function(conn, product) {

  let process = new Promise(function(resolve, reject) {
    try {
      // insert product
      let thisInsert = conn.query(
        'INSERT INTO TAB_PRODUCTS SET ?', product,
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
