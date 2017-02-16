/**
 Provide seperate log for CROS interface with Erply and Shopify
 */
var winston = require('winston');

// Console log output
var logConsole = new winston.transports.Console({
  level: 'debug',
  timestamp: currentTime,
  formatter: logFormatter
});

// info log file transport
var erplyInfoFile = new winston.transports.File({
  name: 'infolog',
  level: 'info',
  filename: './log/erply_info.log',
  timestamp: currentTime,
  formatter: logFormatter
});

// error log file transport
var erplyErrFile = new winston.transports.File({
  name: 'errlog',
  level: 'error',
  filename: './log/erply_error.log',
  timestamp: currentTime,
  formatter: logFormatter
});

// Exception log file transport
var erplyExceptionFile = new winston.transports.File({
  filename: './log/erply_exception.log',
  timestamp: currentTime,
  formatter: logFormatter
});

// info log file transport
var shopifyInfoFile = new winston.transports.File({
  name: 'infolog',
  level: 'info',
  filename: './log/shopify_info.log',
  timestamp: currentTime,
  formatter: logFormatter
});

// error log file transport
var shopifyErrFile = new winston.transports.File({
  name: 'errlog',
  level: 'error',
  filename: './log/shopify_error.log',
  timestamp: currentTime,
  formatter: logFormatter
});

// Exception log file transport
var shopifyExceptionFile = new winston.transports.File({
  filename: './log/shopify_exception.log',
  timestamp: currentTime,
  formatter: logFormatter
});

// Initalize logger
var erplyLogger = new winston.Logger({
  transports: [logConsole, erplyInfoFile, erplyErrFile],
  exceptionHandlers: [erplyExceptionFile]
});

var shopifyLogger = new winston.Logger({
  transports: [logConsole, shopifyInfoFile, shopifyErrFile],
  exceptionHandlers: [shopifyExceptionFile]
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
module.exports = {
  erplyLog: erplyLogger,
  shopifyLog: shopifyLogger
};
