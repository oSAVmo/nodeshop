/** Common log */
var winston = require('winston');

// Console log output
var logConsole = new winston.transports.Console({
  level: 'debug',
  timestamp: currentTime,
  formatter: logFormatter
});

// info log file transport
var infoFile = new winston.transports.File({
  name: 'infolog',
  level: 'info',
  filename: './log/info.log',
  timestamp: currentTime,
  formatter: logFormatter
});

// error log file transport
var errFile = new winston.transports.File({
  name: 'errlog',
  level: 'error',
  filename: './log/error.log',
  timestamp: currentTime,
  formatter: logFormatter
});

// Exception log file transport
var exceptionFile = new winston.transports.File({
  filename: './log/exception.log',
  timestamp: currentTime,
  formatter: logFormatter
});

//Initalize logger
var logger = new winston.Logger({
  transports: [logConsole, infoFile, errFile],
  exceptionHandlers: [exceptionFile]
});

// log formatter
function logFormatter(options) {
  // Return string will be passed to logger.
  return options.timestamp() + '@' + options.level.toUpperCase() + ':' + (
    options.message ? options.message : '') + (options.meta && Object.keys(
    options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
}

// Current time string output
function currentTime() {
  return new Date().toLocaleString();
}

// Export logger
module.exports = logger;
