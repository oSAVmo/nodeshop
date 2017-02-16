/** access for system variables */
const mongo = require('../common/mongo');

let systemDao = {};

/* get system variable by name */
systemDao.getSystemVar = function(name) {
  retun new Promise(funcion(resolve, reject) {
    let col = mongo.conn.collection('system_var');
    col.findOne({
      name: name
    }).then(function(result) {
      resolve(result);
    }).catch(function(error) {
      reject(error);
    });
  });

};

/* update system variable */
systemDao.updateSystemVar = function(name, value) {

  return new Promise(function(resolve, reject) {
    let colSystem = mongo.conn.collection('system_var');

    colSystem.findOneAndUpdate({
      name: name
    }, {
      $set: {
        value: value
      }
    }, {
      upsert: true
    }).then(function(result) {
      resolve(result);
    }).catch(function(error) {
      reject(error);
    });
  });
};

module.exports = systemDao;
