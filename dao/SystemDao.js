/** access for system variables */
const mongo = require('../common/mongo');

const COL_SYS_VAR = 'system_var';
const COL_SCHE_TASK = 'schedule_task';

const STATE_CREATE = 'C';
const STATE_READ = 'R';
const STATE_ERROR = 'E';

let systemDao = {
  module: 'dao',
  name: 'SystemDao'
};

/* get system variable by name */
systemDao.getSystemVar = function(name) {
  return new Promise(function(resolve, reject) {
    let col = mongo.conn.collection(COL_SYS_VAR);
    col.findOne({
      name: name
    }).then(result => {
      resolve(result.value);
    }).catch(error => {
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
      resolve(result.value);
    }).catch(function(error) {
      reject(error);
    });
  });
};

/* insert a task */
systemDao.insertTask = function(apiName, request, doc, priorty) {
  return new Promise(function(resolve, reject) {
    let col = mongo.conn.collection(COL_SCHE_TASK);
    let data = {
      api: apiName,
      request: request,
      doc: doc,
      createTime: Date.now().getTime(),
      priorty: priorty,
      flag: STATE_CREATE
    };
    col.insertOne(data).then(ret => {
      resolve(ret);
    }).catch(err => {
      reject(err);
    });
  });
};

/* read next task */
systemDao.readNextTask = function(apiName) {

  return new Promise(function(resolve, reject) {
    let col = mongo.conn.collection(COL_SCHE_TASK);
    col.findOneAndUpdate({
      // api == apiName
      api: apiName,
      // flag == READ
      flag: STATE_READ
    }, {
      // set flag = READ
      $set: {
        flag: STATE_READ
      }
    }, {
      sort: ['priorty', 'createTime']
    }).then(ret => {
      resolve(ret.value);
    }).catch(err => {
      reject(err);
    });
  });
};

systemDao.erroredTask = async function(taskID) {
  try {
    let col = mongo.conn.collection(COL_SCHE_TASK);
    return await col.findOneAndUpdate({
      _id: taskID
    }, {
      $set: {
        flag: STATE_ERROR
      }
    });
  } catch (e) {
    throw e;
  }
}

systemDao.removeTask = function(taskID) {
  return new Promise(function(resolve, reject) {
    let col = mongo.conn.collection(COL_SCHE_TASK);
    col.findOneAndDelete({
      _id: taskID
    }).then(result => {
      resolve(result);
    }).catch(error => {
      reject(error);
    });
  });
}

module.exports = systemDao;