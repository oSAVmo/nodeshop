/** commonly used utilities */
const _ = require('underscore');

// Format form data from {name:foo, value:bar} to {foo:bar}
exports.formatFormJSON = function(formData) {

  var result = {};
  _.each(formData, function() {
    if (result[this.name] !== undefined) {
      if (!result[this.name].push) {
        result[this.name] = [result[this.name]];
      }
      result[this.name].push(this.value || '');
    } else {
      result[this.name] = this.value || '';
    }
  });
  return result;
}

//MD5 Encryption
exports.md5 = function(str) {

  if (str === null || str === undefined || str.length === 0) {
    return '';
  }

  const crypto = require('crypto');
  return crypto.createHash('md5').update(str).digest('hex');
}

exports.formatDateISO = function(d, seperator) {
  if (d && d instanceof Date) {
    seperator = (seperator ? seperator : '-');
    let yearStr = d.getFullYear() + '';
    let monthStr = ('0' + (d.getMonth() + 1)).slice(-2);
    let dateStr = ('0' + d.getDate()).slice(-2);

    return yearStr + seperator + monthStr + seperator + dateStr;
  } else {
    return null;
  }
}
