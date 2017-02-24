/** Extended data access for product related data, ie product group, unit... */
"use strict";
const mysql = require('../common/mysql');
const log = require('../common/logger');

let dao = {};

/* save units into mysql(most likely from erply sync) */
dao.saveUnits = function(units) {
  return new Promise(function(resolve, reject) {

    mysql.pool.getConnection(function(errConn, conn) {
      if (errConn) {
        reject(errConn);
      }
      conn.beginTransaction(function(errTrans) {
        if (errTrans) {
          reject(errTrans);
        }

        log.info('Delete old units.....');
        conn.query('DELETE FROM SP_TAB_UNITS',
          function(errDelete, deleteResult, deleteFields) {
            log.info('delete finish.');
            if (errDelete) {
              log.error(errDelete);
              conn.rollback();
              conn.release();
              reject(errDelete);
            } else {

              log.info('UNITS deleted from DB... inserting....');

              let data = units.map(unit => [unit.unitID, unit.name]);
              conn.query(
                'INSERT INTO SP_TAB_UNITS(UNIT_ID, UNIT_NAME) VALUES ?', [
                  data
                ],
                function(errInsert, result, fields) {
                  if (errInsert) {
                    log.error(errInsert);
                    reject(errInsert);
                  } else {
                    conn.commit();
                    conn.release();
                    resolve(result);
                  }
                }
              ); // query insert
            }
          }); // query Delete
      }); // transaction
    }); // connection
  }); // return
};

/* get all units or by id if provided */
dao.getUnits = function(unitID) {
  return new Promise(function(resolve, reject) {

    mysql.pool.getConnection(function(errConn, conn) {
      if (errConn) {
        log.error(errConn);
        reject(errConn);
      }
      let sql = 'SELECT UNIT_ID, UNIT_NAME FROM TAB_UNIT';
      if (unitID) {
        sql += ' WHERE unit_id = ?'
      }
      conn.query(sql, unitID, function(errQuery, result, fields) {
        conn.release();

        if (errQuery) {
          log.error(errQuery);
          reject(errQuery);
        };
        resolve(result);
      }); // query
    }); // getConnection
  }); // return new promise
};

module.exports = dao;
