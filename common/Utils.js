var _us = require('underscore');

// format form data from {name:foo, value:bar} to {foo:bar}
exports.formatFormJSON = function(formData) {
  
  var result = {};
  _us.each(formData, function() {
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

exports.md5 = function(str) {
  
  if(str === null || str === undefined || str.length === 0) {
    return '';
  }
  
  const crypto = require('crypto');
  return crypto.createHash('md5').update(str).digest('hex');  
}