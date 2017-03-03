const cron = require('node-cron');
const erplyCtrl = require('../controller/ErplyAPICtrl');
const config = require('../config/conf');

let schedule = {
  module: 'common',
  name: 'Schedule'
}

schedule.dayTask = cron.schedule('*/' + config.scheduleTask.dayTimeInterval + ' * 7-19 * * *', runDayTask);
schedule.nightTask = cron.schedule('*/' + config.scheduleTask.dayTimeInterval + ' * 0-6,19-23 * * *', runNightTask);

function runDayTask() {
  runSavedTasks();
}

function runNightTask() {
  runSavedTasks();
}

function runSavedTasks() {
  erplyCtrl.runSchedule().then().catch();
}

schedule.startAll = function () {
  schedule.dayTask.start();
  schedule.nightTask.start();
}

module.exports = schedule;