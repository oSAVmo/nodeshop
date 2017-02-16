/** Extended data access for product related data, ie product group, unit... */
const mysql = require('../common/mysql');
const log = require('../common/logger');

let dao = {};

/* save units into mysql(most likely from erply sync) */
dao.saveUnits = function(units) {
  return new Promise(function(resolve, reject) {

      mysql.pool.getConnection(errConn, conn) {
        if (errConn) {
          reject(errConn);
        }
        conn.beginTransaction(function(errTrans) {
          if (errTrans) {
            reject(errTrans);
          }
          let processes = units.map(function(unit) {
            return new Promise(function(resolveSingle,
              rejectSingle) {
              let data = {
                unit_id: unit.unitID,
                name: unit.name
              };
              conn.query('INSERT INTO TAB_UNIT SET ?', data,
                function(errInsert, result, fields) {
                  if (errInsert) {
                    log.error(errInsert);
                    rejectSingle(errInsert)
                  } else {
                    resolveSingle(result);
                  }
                }
              ); // query insert
            }); // return new Promise
          }); // processes

          conn.query('DELETE FROM TAB_UNIT', function(errDelete) {
            if (errDelete) {
              log.error(errDelete);
              conn.rollback();
              conn.release();
              reject(err);
            } else {
              Promise.all(processes).then(function(rets) {
                conn.commit();
                conn.release();
                resolve(rets);
              }).catch(err) {
                conn.rollback();
                conn.release();
                reject(rets);
              }; // Promise.all
            }
          }); // query Delete
        }); // transaction
      }); // connection

  }); // return
};

/* get all units or by id if provided */
dao.getUnits = function(unitID) {
  return new Promise(function(resolve, reject) {

      mysql.pool.getConnection(errConn, conn) {
        if (errConn) {
          log.error(errConn);
          reject(errConn);
        }
        let sql = 'SELECT unit_id, name FROM TAB_UNIT';
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
